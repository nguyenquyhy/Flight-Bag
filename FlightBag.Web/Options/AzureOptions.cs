namespace FlightBag.Web
{
    public class AzureOptions
    {
        public StorageAccountOptions StorageAccount { get; set; }

        public class StorageAccountOptions
        {
            public string ConnectionString  { get; set; }
            public string ContainerName { get; set; }
        }
    }
}
