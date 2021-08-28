import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { useMutation } from '@apollo/react-hooks';
import { useSelector, useDispatch } from "react-redux";
import * as AppActions from "../../redux/actions/app.actions";
import Icon, { Icons } from "../../elements/Icon";
import { Colors } from "../../styles/Colors";
import * as Polished from 'polished'
import {
  ModalContainer,
  ModalHeader,
  ModalContent,
} from "./Modal";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeElementStyle } from "@stripe/stripe-js";
import Button from "../../elements/Button";
import CHANGE_MEMBERSHIP_METHOD from '../../graphql/mutations/updateMembershipPayment';
import * as ErrorUtil from "../../utils/ErrorUtil";
import { ModalTypes } from './Modal';
import toast, { Toaster } from 'react-hot-toast';
import { successMessages } from '../../utils/MessageUtil';

export enum PlanTypeEnum {
  Monthly = "Monthly",
  Yearly = "Yearly",
  NotSelected = "",
}

export const TRIAL_DAYS = 30;

const Form = styled.form`
    .Element {
      margin: 0;
      max-width: 100%;
      flex: 1 0 auto;
      outline: 0;
      text-align: left;
      line-height: 1.21428571em;
      background: #fff;
      border-radius: 10px;
      transition: box-shadow 0.1s ease, border-color 0.1s ease;
      box-shadow: none;
      font-size: 14px;
      margin-top: 5px;
      padding: 1.4rem;
      padding-left: 3.7rem;
      height: 17px;
    }
  `;

const Row = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
    flex: 1;
    justify-content: center;
    margin: 30px 0;
  `;

const Spacer = styled.div`
  flex: 0.075;
`;

type ElementContainerProps = {
  focused: boolean;
};

const ElementContainer = styled.div<ElementContainerProps>`
    position: relative;
    flex: 1;
    .Element {
      border: 1px solid
        ${(props) => {
    if (props.focused) return Colors.Grey4;
    return Colors.Grey5;
  }};
  
      &:hover {
        border: 1px solid
          ${(props) => {
    if (props.focused) return Colors.Grey4;
    return Polished.darken(0.05, Colors.Grey5);
  }};
      }
    }
  `;

enum ElementsEnum {
  CardNumber = "CardNumber",
  CVC = "CVC",
  ExpDate = "ExpDate",
}

type UpdatePaymentModalProps = {}

const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = () => {
  /** Hooks **/
  const stripe = useStripe();
  const elements = useElements();

  /* State */

  const appState = useSelector((state: appnameState) => state.app);
  const user: any = useSelector((state: appnameState) => state.user);

  const { membershipId, stripeCustomerId, paymentStatus } = appState;
  const [focused, setFocus] = React.useState<ElementsEnum | null>(null);


  /* Actions */
  const dispatch = useDispatch();
  const popModal = () => dispatch(AppActions.popModal());
  const pushModal = () => dispatch(AppActions.pushModal(ModalTypes.CreateFailedTaskDonation))
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSucessfullyUpdated, setIsSucessfullyUpdated] = useState(false)
  const [onCardSubmit, { loading: changePaymentMethodLoading }] = useMutation(CHANGE_MEMBERSHIP_METHOD, {
    onCompleted: () => {
      if (paymentStatus === "Failed") {
        pushModal()
      }
      else {
        toast.success(successMessages.UPDATE_PAYMENT_SUCCESS);
        setTimeout(() => {
          popModal();
        }, 3000);
      }
      setLoading(false);
      setError("");
    },
    onError: async (error) => {
      const errorMsg = ErrorUtil.getErrorMessage(error);
      setLoading(false);
      setError(
        "Incorrect card details, please try again with correct card details"
      );
    },
  })

  const onUpdatePayment = async () => {
    setLoading(true);
    if (!stripe || !elements) return;
    const card = elements.getElement(CardNumberElement);
    if (!card) return;
    const { error, token } = await stripe.createToken(card);
    if (error?.message) {
      setLoading(false);
      return setError(error.message)
    }
    const organizationId = user?.organization?._id
    const updateParams = { cardToken: token?.id, organizationId, membershipId, stripeCustomerId }
    onCardSubmit({
      variables: {
        params: updateParams
      }
    })
  };

  /** Render */
  const style: StripeElementStyle = {
    base: {
      fontSize: "14px",
      fontWeight: "500",
      color: Colors.Grey1,
      fontSmoothing: "antialiased",
      fontFamily: "neue-haas-grotesk-display",
      "::placeholder": {
        color: Colors.Grey4,
      },
      ":focus": {},
    },
    invalid: {
      color: Colors.Red,
      fontWeight: "550",
    },
  };

  const isFocused = (field: ElementsEnum) => field === focused;
  const iconColor = (field: ElementsEnum) =>
    isFocused(field) ? Colors.Grey3 : Colors.Grey4;

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <ModalContainer width="500px" >
        <ModalHeader title={`Update Payment`} close={popModal} />
        {(() => {
          return (
            <Fragment>
              <ModalContent>
                <Form>
                  <Row>
                    <ElementContainer
                      focused={isFocused(ElementsEnum.CardNumber)}
                    >
                      <Icon
                        icon={Icons.CreditCardFront}
                        color={iconColor(ElementsEnum.CardNumber)}
                        size={14}
                        position="absolute"
                        top="20px"
                        left="15px"
                      />
                      <CardNumberElement
                        className="Element"
                        options={{ style, placeholder: "Card Number" }}
                        onFocus={() => setFocus(ElementsEnum.CardNumber)}
                        onBlur={() => setFocus(null)}
                      />
                    </ElementContainer>
                  </Row>
                  <Row>
                    <ElementContainer focused={isFocused(ElementsEnum.CVC)}>
                      <Icon
                        icon={Icons.CalendarDayLight}
                        color={iconColor(ElementsEnum.CVC)}
                        size={14}
                        position="absolute"
                        top="20px"
                        left="17px"
                      />
                      <CardCvcElement
                        className="Element"
                        options={{ style, placeholder: "CVC" }}
                        onFocus={() => setFocus(ElementsEnum.CVC)}
                        onBlur={() => setFocus(null)}
                      />
                    </ElementContainer>
                    <Spacer />
                    <ElementContainer focused={isFocused(ElementsEnum.ExpDate)}>
                      <Icon
                        icon={Icons.CreditCardBack}
                        color={iconColor(ElementsEnum.ExpDate)}
                        size={14}
                        position="absolute"
                        top="20px"
                        left="15px"
                      />
                      <CardExpiryElement
                        className="Element"
                        options={{ style, placeholder: "Exp. Date" }}
                        onFocus={() => setFocus(ElementsEnum.ExpDate)}
                        onBlur={() => setFocus(null)}
                      />
                    </ElementContainer>
                  </Row>

                  <Button
                    state={""}
                    type="button"
                    onClick={onUpdatePayment}
                    text="Update"
                    // width="120px"
                    loading={loading}
                  />
                  <div style={{ textAlign: 'center' }}>
                    {error &&
                      <p style={{ color: 'red', margin: 'auto', padding: '20px' }}>{error}</p>
                    }
                  </div>
                </Form>
              </ModalContent>
            </Fragment>
          );
        })()}
      </ModalContainer >
    </>
  );
};

export default UpdatePaymentModal;