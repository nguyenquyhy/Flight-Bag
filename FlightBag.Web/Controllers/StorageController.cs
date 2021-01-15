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

        [Route("RequestUploadUrl")]
        [HttpPost]
        public string RequestUploadUrl()
        {
            var sasBuilder = new AccountSasBuilder
            {
                Services = AccountSasServices.Blobs,
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(5),
                Protocol = SasProtocol.Https,
                ResourceTypes = AccountSasResourceTypes.Object | AccountSasResourceTypes.Container,
            };
            sasBuilder.SetPermissions(AccountSasPermissions.Read | AccountSasPermissions.Write | AccountSasPermissions.Update | AccountSasPermissions.Tag);

            var client = new BlobServiceClient(azureOptions.CurrentValue.StorageAccountConnectionString);
            return client.GenerateAccountSasUri(sasBuilder).ToString();
        }
    }
}
