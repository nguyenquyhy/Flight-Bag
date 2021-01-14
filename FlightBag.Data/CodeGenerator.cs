using System;
using System.Collections.Generic;
using System.Text;

namespace FlightBag.Data
{
    public class CodeGenerator
    {
        private const string Characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        private readonly Random random = new Random();

        public string Generate(int length)
        {
            var builder = new StringBuilder();
            for (int i = 0; i < length; i++)
            {
                builder.Append(Characters[random.Next(Characters.Length)]);
            }
            return builder.ToString();
        }
    }
}
