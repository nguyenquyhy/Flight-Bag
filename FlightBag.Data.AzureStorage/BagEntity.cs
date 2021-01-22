using Microsoft.Azure.Cosmos.Table;
using System.Collections.Generic;
using System.Text.Json;

namespace FlightBag.Data.AzureStorage
{
    public class BagEntity : TableEntity
    {
        public BagEntity()
        {

        }

        public BagEntity(Bag bag)
        {
            PartitionKey = "Bag";
            RowKey = bag.Id;
            Timestamp = bag.CreatedDateTime;
            Name = bag.Name;
            ItemsJSON = JsonSerializer.Serialize(bag.Items);
        }

        public Bag ToBag() => new Bag
        {
            Id = RowKey,
            Name = Name,
            CreatedDateTime = Timestamp,
            Items = JsonSerializer.Deserialize<List<BagItem>>(ItemsJSON)
        };

        public string Name { get; set; }
        public string ItemsJSON { get; set; }
    }
}
