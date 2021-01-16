using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace FlightBag.Web.Controllers
{
    public class TwitchController : Controller
    {
        private readonly IOptionsMonitor<TwitchOptions> twitchOptions;

        public TwitchController(IOptionsMonitor<TwitchOptions> twitchOptions)
        {
            this.twitchOptions = twitchOptions;
        }

        public IActionResult Auth()
        {
            return Redirect($"https://id.twitch.tv/oauth2/authorize?response_type=token&client_id={twitchOptions.CurrentValue.ClientId}&redirect_uri={twitchOptions.CurrentValue.RedirectUrl}&scope=chat:read+chat:edit+whispers:read");
        }
    }
}
