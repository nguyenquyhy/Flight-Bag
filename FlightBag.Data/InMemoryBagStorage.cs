using System.Collections.Concurrent;
using System.Threading.Tasks;

namespace FlightBag.Data
{
    public class InMemoryBagStorage : IBagStorage
    {
        private readonly ConcurrentDictionary<string, Bag> bags = new ConcurrentDictionary<string, Bag>();

        public Task<Bag> LoadBagByCodeAsync(string code)
        {
            if (bags.TryGetValue(code, out var bag))
            {
                return Task.FromResult(bag);
            }
            return Task.FromResult<Bag>(null);
        }

        public Task<bool> AddBagAsync(Bag bag)
        {
            return Task.FromResult(bags.TryAdd(bag.Id, bag));
        }

        public Task UpdateBagAsync(Bag bag)
        {
            bags[bag.Id] = bag;
            return Task.CompletedTask;
        }
    }
}
