/**
 * @file history对象
 * @author mengchen <sisimengchen@gmail.com>
 */
import { createBrowserHistory, createHashHistory } from 'history';

const gtag = 'UA-138570751-1';

export const historyMode = process.env.TARGET === 'githubpages' ? 'hashHistory' : 'browserHistory';

const createHistory = historyMode == 'hashHistory' ? createHashHistory : createBrowserHistory;

export const history = createHistory({
  getUserConfirmation: (message, callback) => callback(true),
  forceRefresh: false
});

export let unlisten = history.listen((location, action) => {
  window.gtag &&
    window.gtag('config', gtag, {
      page_path: window.location.pathname,
      page_location: window.location.href
    });
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`);
  console.log(`The last navigation action was ${action}`);
});

export let unblock = history.block((location, action) => '测试文案');