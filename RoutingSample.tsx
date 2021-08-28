import { Fragment } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import PageLoader from "./components/PageLoader";
import ReactTooltip from "react-tooltip";
import Modal from "./components/modal/Modal";
// Auth
import Login from "./pages/Login.page";
import Register from "./pages/Register.page";
import ForgotPassword from "./pages/ForgotPassword.page";
import ResetPassword from "./pages/ResetPassword.page";
import VerifyEmail from "./pages/VerifyEmail.page";
//Dasbhoard
import DashboardLayout from "./components/DashboardLayout";
import DonationsPage from "./pages/Donations.page";
import InstallButtonPage from "./pages/InstallButton.page";
import SettingsPage from "./pages/Settings.page";
import SuperAdminPage from "./pages/SuperAdmin.page";
import LandingPage from "./pages/Landing.page";
import GuestSettings from "./pages/GuestSettings.page";
import GuestLayout from "./components/GuestLayout";
import OrganizationProfilePage from "./pages/OrganizationProfile.page";
import DashboardPage from "./pages/Dashboard.page";
import YourPage from "./pages/YourPage.page";
import NewCampaignPage from "./pages/NewCampaigns.page";
import CampaignsList from "./pages/CampaignsList.page";
import CampaignPage from "./pages/Campaigns.page";
import NotFoundPage from "./pages/NotFound.page";
import NewMatchesPage from "./pages/NewMatches.page";
import CampaignMatchesList from "./components/CampaignMatchesList";

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;

const Tooltip = styled(ReactTooltip)`
  border-radius: 10px;
  padding: 7px 10px;
`;

function DashboardContainer({ match }: any) {
  return (
    <DashboardLayout>
      <Switch>
        <Redirect exact from={`${match.path}/`} to={`${match.path}/overview`} />
        <Route
          exact
          path={`${match.path}/overview`}
          component={DonationsPage}
        />
         <Route
          exact
          path={`${match.path}/home`}
          component={DashboardPage}
        />
        <Route
          exact
          path={`${match.path}/install-button`}
          component={InstallButtonPage}
        />
        <Route
          exact
          path={`${match.path}/campaigns`}
          component={CampaignsList}
        />
        <Route exact path={`${match.path}/settings`} component={SettingsPage} />
        <Route exact path={`${match.path}/super`} component={SuperAdminPage} />
        <Route exact path={`${match.path}/your-page`} component={YourPage} />
        <Route exact path={`${match.path}/campaigns/new`} component={NewCampaignPage} />
        <Route exact path={`${match.path}/campaigns/edit`} component={NewCampaignPage} />
        <Route exact path={`${match.path}/campaigns/matches/new`} component={NewMatchesPage} />
        <Route exact path={`${match.path}/campaigns/matches/edit`} component={NewMatchesPage} />
        <Route
          exact
          path={`${match.path}/campaigns/overview`}
          component={CampaignPage}
        />
        <Route
          exact
          path={`${match.path}/campaigns/matches`}
          component={CampaignPage}
        />
         <Route exact path="*" component={NotFoundPage} />
      </Switch>
    </DashboardLayout>
  );
}

function GuestContainer({ match }: any) {
  return (
    <GuestLayout>
      <Switch>
        <Redirect exact from={`${match.path}/`} to={`${match.path}/settings`} />
        <Route
          exact
          path={`${match.path}/settings`}
          component={GuestSettings}
        />
      </Switch>
    </GuestLayout>
  );
}



export default function App() {
  return (
    <Fragment>
      <Modal />
      <PageLoader />
      <Container>
        <Switch>
          <Redirect exact from="/" to="/landing" />
          <Route path="/login" component={Login} />
          <Route path="/landing" component={LandingPage} />
          <Route path="/register" component={Register} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/verify-email" component={VerifyEmail} />
          <Route path="/guest" component={GuestContainer} />
          <Route path="/dashboard" component={DashboardContainer} />
          <Route path="/org/:stub" component={OrganizationProfilePage} />  
        </Switch>
      </Container>
    </Fragment>
  );
}
