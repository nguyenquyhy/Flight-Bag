using System.Threading.Tasks;

namespace FlightBag.Data
{
    public interface IBagStorage
    {
        Task<bool> AddBagAsync(Bag bag);
        Task UpdateBagAsync(Bag bag);
        Task<Bag> LoadBagByCodeAsync(string code);
    }
}
