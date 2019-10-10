/*
 *
 * (c) Copyright Ascensio System Limited 2010-2018
 *
 * This program is freeware. You can redistribute it and/or modify it under the terms of the GNU 
 * General Public License (GPL) version 3 as published by the Free Software Foundation (https://www.gnu.org/copyleft/gpl.html). 
 * In accordance with Section 7(a) of the GNU GPL its Section 15 shall be amended to the effect that 
 * Ascensio System SIA expressly excludes the warranty of non-infringement of any third-party rights.
 *
 * THIS PROGRAM IS DISTRIBUTED WITHOUT ANY WARRANTY; WITHOUT EVEN THE IMPLIED WARRANTY OF MERCHANTABILITY OR
 * FITNESS FOR A PARTICULAR PURPOSE. For more details, see GNU GPL at https://www.gnu.org/copyleft/gpl.html
 *
 * You can contact Ascensio System SIA by email at sales@onlyoffice.com
 *
 * The interactive user interfaces in modified source and object code versions of ONLYOFFICE must display 
 * Appropriate Legal Notices, as required under Section 5 of the GNU GPL version 3.
 *
 * Pursuant to Section 7 § 3(b) of the GNU GPL you must retain the original ONLYOFFICE logo which contains 
 * relevant author attributions when distributing the software. If the display of the logo in its graphic 
 * form is not reasonably feasible for technical reasons, you must include the words "Powered by ONLYOFFICE" 
 * in every copy of the program you distribute. 
 * Pursuant to Section 7 § 3(e) we decline to grant you any rights under trademark law for use of our trademarks.
 *
*/


using System;
using System.Collections.Generic;
using System.Reflection;
using ASC.Core.Notify;
using ASC.Core.Notify.Senders;
using ASC.Core.Tenants;
using ASC.Notify.Engine;
using ASC.Web.Core.Users;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Constants = ASC.Core.Configuration.Constants;
using NotifyContext = ASC.Notify.Context;

namespace ASC.Core
{
    public static class WorkContext
    {
        private static readonly object syncRoot = new object();
        private static bool notifyStarted;
        private static bool? ismono;
        private static string monoversion;


        public static NotifyContext NotifyContext { get; private set; }

        public static string[] DefaultClientSenders
        {
            get { return new[] { Constants.NotifyEMailSenderSysName, }; }
        }

        public static bool IsMono
        {
            get
            {
                if (ismono.HasValue)
                {
                    return ismono.Value;
                }

                var monoRuntime = Type.GetType("Mono.Runtime");
                ismono = monoRuntime != null;
                if (monoRuntime != null)
                {
                    var dispalayName = monoRuntime.GetMethod("GetDisplayName", BindingFlags.NonPublic | BindingFlags.Static);
                    if (dispalayName != null)
                    {
                        monoversion = dispalayName.Invoke(null, null) as string;
                    }
                }
                return ismono.Value;
            }
        }

        public static string MonoVersion
        {
            get
            {
                return IsMono ? monoversion : null;
            }
        }


        public static void NotifyStartUp(IServiceProvider serviceProvider)
        {
            if (notifyStarted) return;
            lock (syncRoot)
            {
                if (notifyStarted) return;

                var configuration = serviceProvider.GetService<IConfiguration>();
                NotifyContext = new NotifyContext(serviceProvider.GetService<CoreBaseSettings>(), configuration);

                INotifySender jabberSender = new NotifyServiceSender();
                INotifySender emailSender = new NotifyServiceSender();

                var postman = configuration["core:notify:postman"];

                if ("ases".Equals(postman, StringComparison.InvariantCultureIgnoreCase) || "smtp".Equals(postman, StringComparison.InvariantCultureIgnoreCase))
                {
                    jabberSender = new JabberSender(serviceProvider);

                    var properties = new Dictionary<string, string>
                    {
                        ["useCoreSettings"] = "true"
                    };
                    if ("ases".Equals(postman, StringComparison.InvariantCultureIgnoreCase))
                    {
                        emailSender = new AWSSender(serviceProvider);
                        properties["accessKey"] = configuration["ses:accessKey"];
                        properties["secretKey"] = configuration["ses:secretKey"];
                        properties["refreshTimeout"] = configuration["ses:refreshTimeout"];
                    }
                    else
                    {
                        emailSender = new SmtpSender(serviceProvider);
                    }
                    emailSender.Init(properties);
                }

                NotifyContext.NotifyService.RegisterSender(Constants.NotifyEMailSenderSysName, new EmailSenderSink(emailSender, serviceProvider));
                NotifyContext.NotifyService.RegisterSender(Constants.NotifyMessengerSenderSysName, new JabberSenderSink(jabberSender, serviceProvider));

                NotifyContext.NotifyEngine.BeforeTransferRequest += NotifyEngine_BeforeTransferRequest;
                NotifyContext.NotifyEngine.AfterTransferRequest += NotifyEngine_AfterTransferRequest;
                notifyStarted = true;
            }
        }

        private static void NotifyEngine_BeforeTransferRequest(NotifyEngine sender, NotifyRequest request, UserManager userManager, AuthContext authContext, DisplayUserSettings displayUserSettings)
        {
            request.Properties.Add("Tenant", CoreContext.TenantManager.GetCurrentTenant(false));
        }

        private static void NotifyEngine_AfterTransferRequest(NotifyEngine sender, NotifyRequest request)
        {
            if ((request.Properties.Contains("Tenant") ? request.Properties["Tenant"] : null) is Tenant tenant)
            {
                CoreContext.TenantManager.SetCurrentTenant(tenant);
            }
        }
    }
}