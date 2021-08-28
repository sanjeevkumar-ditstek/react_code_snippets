import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { useQuery, useMutation } from "@apollo/react-hooks";
import StripeButton from "../assets/images/stripe-button.png";
import url from "url";
import PLATFORM_SETTINGS from "../graphql/queries/platformSettings.query";
import IPlatformSettings from "@appname/models/.dist/interfaces/IPlatformSettings";
import Label from "../elements/Label";
import { Colors } from "../styles/Colors";
import Icon, { Icons } from "../elements/Icon";
import CONNECT_STRIPE from "../graphql/mutations/connectStripe.mutation";
import { useHistory } from "react-router-dom";
import * as AppActions from "../redux/actions/app.actions";
import { useDispatch } from "react-redux";
import Loader from "../elements/Loader";

interface IPlatformSettingsData {
  platformSettings: IPlatformSettings;
}

const Container = styled.div`
  position: relative;

`;

const ButtonImg = styled.img`
  cursor: pointer;
  width: 230px;
  height: auto;
`;

const Text = styled.div`
  font-size: 1.4rem;
  color: ${Colors.Grey2};
  font-weight: 500;
  margin-top: 20px;
  line-height: 160%;
`;

const HasStripe = styled.div`
  font-size: 1.8rem;
  color: ${Colors.Green};
  font-weight: 600;
  line-height: 160%;
  display: flex;
`;

const LoaderContainer = styled.div`
  width: 400px;
  height: 70px;
  margin-top: 30px;
  justify-content: center;
  display: flex;
`;

type ConnectStripeProps = {
  stripeConnectId?: string;
  onComplete?: Function;
};

const ConnectStripe: React.FC<ConnectStripeProps> = ({
  stripeConnectId,
  onComplete,
}) => {
  const { data } = useQuery<IPlatformSettingsData>(PLATFORM_SETTINGS);
  const [isClicked, setIsClicked] = useState(false);
  const history = useHistory();
  const stripeClientId = data?.platformSettings.stripeClientId ?? null;
  const stripeRedirectUrl = data?.platformSettings.stripeRedirectUrl ?? null;
  const parsed = url.parse(window.location.toString(), true);

  const dispatch = useDispatch();
  //   const getUser = () => dispatch(UserActions.getUser());

  const connectCode = parsed?.query?.code;
  const [connectStripe, { loading: savingStripeConnectId }] = useMutation(
    CONNECT_STRIPE,
    {
      onCompleted(data) {
        history.push(`/dashboard/overview`);
        dispatch(AppActions.popModal());
       
      },
    }
  );

  React.useEffect(() => {  
    if (connectCode) {
      connectStripe({
        variables: {
          connectCode,
        },
      });
    }
  }, []);

  const baseLink = "https://connect.stripe.com/oauth/authorize";
  const clientId = `?client_id=${stripeClientId}`;
  const redirectUrl = `&redirect_uri=${stripeRedirectUrl}`;
  const responseType = "&response_type=code";
  const scopes = "&scope=read_write";
  const connectLink = baseLink + clientId + redirectUrl + responseType + scopes;

  return (
    <Container>
      <Label text="Stripe Connection" />
      {stripeConnectId ? (
        <HasStripe>
          Stripe is connected
          <Icon icon={Icons.Check} color={Colors.Green} margin="0 0 0 5px" />
        </HasStripe>
      ) : (
        <Fragment>
          <>
            {savingStripeConnectId || isClicked ? (
              <>
                <Text>
                  Stripe is connecting.. please wait, you will be redirected
                  shortly.
                </Text>
                <LoaderContainer>
                  <Loader />
                </LoaderContainer>
              </>
            ) : (
              <>
                <ButtonImg
                  onClick={() => {
                    setIsClicked(true);
                    window.location.replace(connectLink);
                  }}
                  src={StripeButton}
                />
                <Text>
                  We use Stripe for payment processing because it is the most
                  trusted payment processing platform in the world. In order to
                  receive donations from appname, you must connect Stripe.
                </Text>
              </>
            )}
          </>
        </Fragment>
      )}
    </Container>
  );
};

export default ConnectStripe;
