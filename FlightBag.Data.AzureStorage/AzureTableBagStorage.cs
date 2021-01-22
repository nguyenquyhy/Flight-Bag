using FlightBag.Data.AzureStorage;
using Microsoft.Azure.Cosmos.Table;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;

namespace FlightBag.Data
{
    public class AzureTableBagStorage : IBagStorage
    {
        private readonly IOptionsMonitor<AzureOptions> azureOptions;
        private readonly CloudTable table;

        public AzureTableBagStorage(IOptionsMonitor<AzureOptions> azureOptions)
        {
            this.azureOptions = azureOptions;

            var account = CloudStorageAccount.Parse(azureOptions.CurrentValue.StorageAccount.ConnectionString);
            var client = account.CreateCloudTableClient();
            table = client.GetTableReference(azureOptions.CurrentValue.StorageAccount.BagTableName);
        }

        public async Task<Bag> LoadBagByCodeAsync(string code)
        {
            await table.CreateIfNotExistsAsync();
            var result = await table.ExecuteAsync(TableOperation.Retrieve<BagEntity>("Bag", code));
            if (result.Result is BagEntity entity)
            {
                return entity.ToBag();
            }
            return null;
        }

        public async Task<bool> AddBagAsync(Bag bag)
        {
            await table.CreateIfNotExistsAsync();
            var result = await table.ExecuteAsync(TableOperation.InsertOrMerge(new BagEntity(bag)));

            if (result.Result is BagEntity)
            {
                return true;
            }
            return false;
        }

        public async Task UpdateBagAsync(Bag bag)
        {
            await table.CreateIfNotExistsAsync();
            var result = await table.ExecuteAsync(TableOperation.Replace(new BagEntity(bag) { ETag = "*" }));
        }
    }
}
