using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace ProcCore.Business.DB0
{
    [MetadataType(typeof(MatterMetadata))]
    public partial class Matter
    {
        public string community_name { get; set; }

        public string imgurl_MatterPhoto_1 { get; set; }
        public string[] imgurl_MatterPhoto { get; set; }
        public string imgurl_MatterStyle { get; set; }

        private class MatterMetadata
        {
            [JsonIgnore()]
            public virtual Community Community { get; set; }
        }
    }
}

