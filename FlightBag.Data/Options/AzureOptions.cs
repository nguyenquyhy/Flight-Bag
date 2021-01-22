using System.ComponentModel.DataAnnotations;

namespace FlightBag
{
    public class AzureOptions
    {
        [Required]
        public StorageAccountOptions StorageAccount { get; set; }

        public class StorageAccountOptions
        {
            [Required]
            public string ConnectionString  { get; set; }
            [Required]
            public string ContainerName { get; set; }
            [Required]
            public string BagTableName { get; set; }
        }
    }
}
