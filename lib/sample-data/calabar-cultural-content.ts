import { CulturalContent } from '@/types/carnival';

export const culturalContent: Omit<CulturalContent, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    title: "The Birth of Calabar Carnival",
    content: `The Calabar Carnival, often referred to as "Africa's Biggest Street Party," was established in 2004 by former Cross River State Governor Donald Duke. What began as a vision to transform Calabar into a major tourist destination has evolved into one of Africa's most spectacular cultural celebrations.

The carnival was designed to showcase the rich cultural heritage of Cross River State and Nigeria as a whole, while also boosting tourism and economic development in the region. Over the years, it has grown from a local celebration to an internationally recognized event that attracts visitors from around the world.`,
    category: "history",
    imageUrl: "/images/culture/carnival-history.jpg",
    orderIndex: 1
  },
  {
    title: "Traditional Dances of Cross River State",
    content: `Cross River State is home to diverse ethnic groups, each with unique traditional dances that form the backbone of carnival performances:

**Ekombi Dance**: Performed by the Efik people, this graceful dance features synchronized movements and colorful attire. Dancers move in harmony to the rhythm of traditional drums, celebrating unity and cultural pride.

**Ekpe Dance**: A sacred masquerade dance of the Efik and Ibibio people, traditionally performed by members of the Ekpe secret society. The dance features elaborate costumes and powerful movements that command respect and reverence.

**Monikim Dance**: Originating from the Yakurr people, this energetic dance celebrates harvest and fertility. Dancers wear vibrant costumes adorned with beads and perform acrobatic movements to the beat of traditional instruments.

**Leboku Dance**: Performed during the New Yam Festival by the Yakurr people, this dance gives thanks for bountiful harvests and seeks blessings for the coming season.`,
    category: "dances",
    imageUrl: "/images/culture/traditional-dances.jpg",
    orderIndex: 2
  },
  {
    title: "Carnival Costumes and Regalia",
    content: `The costumes worn during Calabar Carnival are masterpieces of creativity and craftsmanship, blending traditional African aesthetics with contemporary design:

**Traditional Elements**: Many costumes incorporate traditional fabrics like Ankara, Aso-Oke, and hand-woven textiles. Beadwork, cowrie shells, and natural materials like raffia and feathers are commonly used to create authentic African designs.

**Modern Innovation**: Contemporary carnival costumes feature elaborate feathered headdresses, sequined bodysuits, and LED-lit accessories. Designers spend months creating these spectacular outfits, often weighing over 50 pounds.

**Band Themes**: Each carnival band selects a unique theme that influences their costume design. Themes range from African royalty and wildlife to futuristic concepts and cultural fusion. The costumes tell stories and celebrate African heritage while pushing creative boundaries.

**Craftsmanship**: Local artisans and designers work year-round to create these magnificent costumes, supporting local economies and preserving traditional craft techniques while innovating with modern materials.`,
    category: "costumes",
    imageUrl: "/images/culture/carnival-costumes.jpg",
    orderIndex: 3
  },
  {
    title: "The Sounds of Carnival: Music and Rhythm",
    content: `Music is the heartbeat of Calabar Carnival, featuring a rich blend of traditional and contemporary sounds:

**Traditional Instruments**: The carnival showcases indigenous instruments including:
- **Ekwe** (wooden slit drum): Provides the foundational rhythm
- **Udu** (clay pot drum): Creates deep, resonant tones
- **Ọgẹnẹ** (metal gong): Adds bright, cutting accents
- **Ékpiri** (thumb piano): Produces melodic patterns

**Contemporary Fusion**: Modern carnival music blends traditional rhythms with Afrobeats, highlife, and contemporary Nigerian pop music. Live bands and DJs create an electrifying atmosphere that keeps revelers dancing throughout the parade.

**Carnival Anthems**: Each year, special carnival songs are composed and become the soundtrack of the celebration. These songs often incorporate local languages and celebrate Cross River State's cultural identity.

**Street Performances**: Beyond the main parade, street musicians and cultural troupes perform throughout Calabar, creating a city-wide celebration of sound and rhythm.`,
    category: "music",
    imageUrl: "/images/culture/carnival-music.jpg",
    orderIndex: 4
  },
  {
    title: "Cross River State: The People's Paradise",
    content: `Cross River State, known as "The People's Paradise," is blessed with rich cultural heritage and natural beauty:

**Ethnic Diversity**: The state is home to numerous ethnic groups including the Efik, Ejagham, Bekwarra, Yakurr, Bahumono, and many others. This diversity creates a rich tapestry of languages, traditions, and cultural practices.

**Historical Significance**: Calabar served as a major port during the colonial era and was the first capital of Nigeria. The city's historical sites include the Duke Town Church (1846), the National Museum, and the colonial-era buildings that line the streets.

**Natural Heritage**: Beyond culture, Cross River State boasts incredible natural attractions including:
- Cross River National Park: Home to endangered species like the Cross River gorilla
- Obudu Mountain Resort: A stunning highland retreat
- Kwa Falls: A magnificent natural waterfall
- Agbokim Waterfalls: Seven-stream cascading falls

**Cultural Preservation**: The state government actively works to preserve and promote indigenous cultures through festivals, museums, and cultural centers, ensuring that traditional knowledge and practices are passed to future generations.`,
    category: "heritage",
    imageUrl: "/images/culture/cross-river-heritage.jpg",
    orderIndex: 5
  },
  {
    title: "Carnival Timeline: Two Decades of Celebration",
    content: `Since its inception in 2004, Calabar Carnival has evolved into a world-class event:

**2004**: The inaugural Calabar Carnival takes place, establishing the foundation for what would become Africa's biggest street party.

**2006**: The carnival gains national recognition, attracting visitors from across Nigeria and neighboring countries.

**2008**: International participation begins, with performers and visitors from Europe, America, and other African nations joining the celebration.

**2010**: The carnival is officially recognized as one of Africa's premier cultural festivals, drawing comparisons to Rio Carnival and Trinidad Carnival.

**2012**: Introduction of the Carnival Calabar International Band Competition, elevating the artistic standards and creativity of participating bands.

**2015**: The carnival celebrates over one million attendees, cementing its status as a major tourist attraction.

**2018**: Digital innovation brings live streaming and social media integration, allowing global audiences to experience the carnival remotely.

**2020-2021**: The carnival adapts to global challenges with virtual events and smaller-scale celebrations, demonstrating resilience and innovation.

**2023**: Return to full-scale celebrations with record-breaking attendance and international media coverage.

**2025**: The carnival continues to grow, blending tradition with innovation while maintaining its core mission of celebrating African culture and heritage.`,
    category: "timeline",
    imageUrl: "/images/culture/carnival-timeline.jpg",
    orderIndex: 6
  },
  {
    title: "The Spirit of Ubuntu: Community and Unity",
    content: `At its heart, Calabar Carnival embodies the African philosophy of Ubuntu - "I am because we are." The carnival brings together people from all walks of life in a celebration of shared humanity:

**Community Participation**: Thousands of local residents participate in the carnival, from performers and costume makers to vendors and volunteers. The event creates economic opportunities and fosters community pride.

**Cultural Exchange**: The carnival serves as a platform for cultural exchange, where different ethnic groups showcase their traditions and learn from one another, promoting understanding and unity.

**Youth Empowerment**: Young people play a central role in the carnival, with youth bands, dance troupes, and creative workshops that nurture talent and preserve cultural knowledge for future generations.

**Social Impact**: Beyond entertainment, the carnival addresses social issues through themed performances and awareness campaigns, using the power of culture to inspire positive change.

**Global Connection**: While deeply rooted in local tradition, the carnival connects Cross River State to the global community, showcasing Nigerian culture on the world stage and attracting international collaboration.`,
    category: "community",
    imageUrl: "/images/culture/carnival-community.jpg",
    orderIndex: 7
  }
];
