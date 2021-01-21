using Azure.Storage.Blobs;
using Azure.Storage.Sas;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;

namespace FlightBag.Web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StorageController : Controller
    {
        private readonly IOptionsMonitor<AzureOptions> azureOptions;

        public StorageController(IOptionsMonitor<AzureOptions> azureOptions)
        {
            this.azureOptions = azureOptions;
        }

        [Route("RequestUploadInfo")]
        [HttpPost]
        public object RequestUploadInfo()
        {
            var sasBuilder = new AccountSasBuilder
            {
                Services = AccountSasServices.Blobs,
                StartsOn = DateTimeOffset.UtcNow.AddMinutes(-5),
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5),
                Protocol = SasProtocol.Https,
                ResourceTypes = AccountSasResourceTypes.Object | AccountSasResourceTypes.Container,
            };
            sasBuilder.SetPermissions(AccountSasPermissions.Read | AccountSasPermissions.Write | AccountSasPermissions.Update | AccountSasPermissions.Tag);

            var client = new BlobServiceClient(azureOptions.CurrentValue.StorageAccount.ConnectionString);
            return new { Sas = client.GenerateAccountSasUri(sasBuilder).ToString(), ContainerName = azureOptions.CurrentValue.StorageAccount.ContainerName };
        }
    }
}
