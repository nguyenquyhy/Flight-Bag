using System;
using System.Collections.Generic;

namespace FlightBag.Data
{
    public class Bag
    {
        public string Id { get; set; }
        public DateTimeOffset CreatedDateTime { get; set; }

        public string Name { get; set; }

        public List<BagItem> Items { get; set; } = new List<BagItem>();
    }
}
