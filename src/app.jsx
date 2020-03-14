/* eslint-disable no-unused-vars */
import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import Loading from 'components/Loading';
import Launch from 'components/Launch';
import CoreLayout from 'layouts/CoreLayout';
/**
 * 应用程序Component.
 */
class App extends PureComponent {
  props = {
    appLoaded: false
  };

  state = {};

  render() {
    const { appLoaded } = this.props;
    return (
      <Fragment>
        <Loading />
        {appLoaded ? null : <Launch appLoaded={appLoaded} />}
        {appLoaded ? <CoreLayout /> : null}
      </Fragment>
    );
  }
}

const mapStateToProps = ({ app }) => ({
  appLoaded: app.appLoaded
});

export default connect(mapStateToProps)(App);
