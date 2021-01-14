namespace FlightBag.Data
{
    public class BagItem
    {
        public string Title { get;set; }
        public string Type { get; set; }
        public object Data { get; set; }
    }

    public enum BagItemType
    {
        WebSite,
        Image
    }
}
