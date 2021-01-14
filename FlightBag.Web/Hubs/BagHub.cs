using FlightBag.Data;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace FlightBag.Web.Hubs
{
    public class BagHub : Hub
    {
        private readonly IBagStorage bagStorage;
        private readonly CodeGenerator codeGenerator;

        public BagHub(IBagStorage bagStorage, CodeGenerator codeGenerator)
        {
            this.bagStorage = bagStorage;
            this.codeGenerator = codeGenerator;
        }

        public async Task CreateBag()
        {
            var bag = new Bag
            {
                Id = new string(codeGenerator.Generate(7)),
            };

            if (await bagStorage.AddBagAsync(bag))
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "bag:" + bag.Id);
                await Clients.Caller.SendAsync("UpdateBag", bag);
            }
        }

        public async Task JoinBag(string code)
        {
            var bag = await bagStorage.LoadBagByCodeAsync(code);
            if (bag != null)
            {
                await Groups.AddToGroupAsync(Context.ConnectionId, "bag:" + bag.Id);
                await Clients.Caller.SendAsync("UpdateBag", bag);
            }
        }

        public async Task UpdateBag(Bag bag)
        {
            var existing = await bagStorage.LoadBagByCodeAsync(bag.Id);
            if (existing != null)
            {
                await bagStorage.UpdateBagAsync(bag);
                await Clients.Group("bag:" + bag.Id).SendAsync("UpdateBag", bag);
            }
        }

    }
}
