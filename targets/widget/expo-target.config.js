/** @type {import('@bacons/apple-targets').Config} */
module.exports = {
  type: "widget",
  name: "ReportFocusWidget",
  displayName: "Report Focus News",
  deploymentTarget: "17.0",
  entitlements: {
    "com.apple.security.application-groups": [
      "group.com.sambulosenda.reportfocusnews.widget"
    ],
  },
};
