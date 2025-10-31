exports.httpHandler = {
  endpoints: [
    {
      method: 'GET',
      path: 'debug',
      handle: function handle(ctx) {
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#request
        const requestParam = ctx.request.getParameter('test');
        // See https://www.jetbrains.com/help/youtrack/devportal-apps/apps-reference-http-handlers.html#response
        ctx.response.json({ test: requestParam });
      }
    },
    {
      method: 'GET',
      path: 'test-management-flag',
      handle: function handle(ctx) {
        try {
          const { testManagementEnabled } = ctx.globalStorage.extensionProperties;
          ctx.response.json({ enabled: testManagementEnabled === true });
        } catch (error) {
          ctx.response.json({ enabled: false });
        }
      }
    },
    {
      method: 'POST',
      path: 'test-management-flag',
      handle: function handle(ctx) {
        const body = ctx.request.json();
        const enabled = body.enabled === true;
        ctx.globalStorage.extensionProperties.testManagementEnabled = enabled;
        ctx.response.json({ success: true, enabled: enabled });
      }
    }
  ]
};
