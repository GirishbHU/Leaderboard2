import { db } from "./db";
import { blogArticles } from "@shared/schema";
import { sql } from "drizzle-orm";

const articleUrlMap: Record<string, string> = {
  "Danny Auble: The Architect of Open-Source HPC Innovation Leading SchedMD into the NVIDIA Era": "https://www.linkedin.com/pulse/danny-auble-architect-open-source-hpc-innovation-leading-hukkeri-vwzlc",
  "Genesis of IBM and Thomas Watson Sr.: From Computing-Tabulating-Recording to Computing Dominance (1896–1956)": "https://www.linkedin.com/pulse/genesis-ibm-thomas-watson-sr-from-computing-dominance-girish-hukkeri-mspwc",
  "Beyond Labels: Weak and Self-Supervised Learning as the Path to Unlimited Data and Scalable AI": "https://www.linkedin.com/pulse/beyond-labels-weak-self-supervised-learning-path-data-girish-hukkeri-o8dvc",
  "DevRev: Bridging the Developer-Customer Gap and Reshaping the Enterprise CRM Market": "https://www.linkedin.com/pulse/devrev-bridging-developer-customer-gap-reshaping-crm-market-hukkeri-qwegc",
  "Zeroth Principles Extended Series": "https://www.linkedin.com/pulse/zeroth-principles-extended-series-girish-hukkeri-dgxtc",
  "The Seven-Year-Old Test: Building Artificial Common Sense as the Foundation for General Intelligence": "https://www.linkedin.com/pulse/seven-year-old-test-building-artificial-common-sense-general-hukkeri-vfpac",
  "Niccolo de Masi: The Physicist-CEO Leading IonQ's Quantum Revolution": "https://www.linkedin.com/pulse/niccolo-de-masi-physicist-ceo-leading-ionqs-quantum-girish-hukkeri-ztezc",
  "From Prediction to Understanding: Causal Inference as the Gateway to True AI": "https://www.linkedin.com/pulse/from-prediction-understanding-causal-inference-gateway-girish-hukkeri-5uxnc",
  "Dheeraj Pandey: The Architect of Hybrid Cloud Infrastructure and the Visionary Reshaping Enterprise IT": "https://www.linkedin.com/pulse/dheeraj-pandey-architect-hybrid-cloud-infrastructure-girish-hukkeri-dlubc",
  "Zeroth Principles - Part Two: AI as Spectacle, Humanity's Infinite Mirror": "https://www.linkedin.com/pulse/zeroth-principles-part-two-ai-spectacle-humanitys-infinite-hukkeri-u6vrc",
  "Meta's AI Present and Future: Llama, AGI, and the 2025-'30 Vision": "https://www.linkedin.com/pulse/metas-ai-present-future-llama-agi-2025-30-vision-girish-hukkeri-i90je",
  "Zeroth Principles - Part One: The Insight Precedes the Invention": "https://www.linkedin.com/pulse/zeroth-principles-part-one-insight-precedes-invention-girish-hukkeri-ugwgc",
  "Meta's Mobile Revolution and Advertising Dominance (2012-'18)": "https://www.linkedin.com/pulse/metas-mobile-revolution-advertising-dominance-2012-18-girish-hukkeri-xrdqe",
  "Building Artificial Minds: World Models and Cognitive Development as the Path to AGI": "https://www.linkedin.com/pulse/building-artificial-minds-world-models-cognitive-path-girish-hukkeri-fauze",
  "Meta's Metaverse Pivot and Reality Labs Investment (2019-'23)": "https://www.linkedin.com/pulse/metas-metaverse-pivot-reality-labs-investment-2019-23-girish-hukkeri-gsyae",
  "Physics-Informed Machine Learning: Embedding the Laws of Nature into AI": "https://www.linkedin.com/pulse/physics-informed-machine-learning-embedding-laws-nature-hukkeri-ceqke",
  "Meta's Genesis: From Harvard Dorm to Social Media Empire (2004-2012)": "https://www.linkedin.com/pulse/metas-genesis-from-harvard-dorm-social-media-empire-girish-hukkeri-hwdae",
  "The AI Spring and the Lingering Winter: Beyond Pattern Recognition to Understanding Unknown Laws": "https://www.linkedin.com/pulse/ai-spring-lingering-winter-beyond-pattern-recognition-girish-hukkeri-61gze",
  "Entertainment in the AI Era: Generative Content, Personalization, and Future Models (2025-'30)": "https://www.linkedin.com/pulse/entertainment-ai-era-generative-content-future-models-girish-hukkeri-ioxee",
  "Streaming Wars, Password Sharing Crackdown, and Profitability Focus (2015-2025)": "https://www.linkedin.com/pulse/streaming-wars-password-sharing-crackdown-focus-girish-hukkeri-eoq7e",
  "Netflix Origins and DVD Disruption (1997-2005)": "https://www.linkedin.com/pulse/netflix-origins-dvd-disruption-1997-2005-girish-hukkeri-v90xe",
  "Netflix Acquires Warner Bros. Discovery: The Entertainment Industry Consolidation Catalyst (December 2025)": "https://www.linkedin.com/pulse/netflix-acquires-warner-bros-discovery-entertainment-industry-girish-7as0e",
  "Jacob DeWitte & Caroline Cochran: Building the Nuclear Renaissance Through Oklo Inc.": "https://www.linkedin.com/pulse/jacob-dewitte-caroline-cochran-building-nuclear-through-hukkeri-0aoye",
  "Monte Carlo Simulation and Its Impact on AI": "https://www.linkedin.com/pulse/monte-carlo-simulation-its-impact-ai-girish-hukkeri-5ca4e",
  "Rajeeb (Raj) Hazra: The Architect Behind Quantinuum's Quantum Revolution": "https://www.linkedin.com/pulse/rajeeb-raj-hazra-architect-behind-quantinuums-quantum-girish-hukkeri-ovqke",
  "Microsoft's AI Future: Copilot Integration, Quantum Computing, AI Infrastructure, and Path to AGI (2025-2035)": "https://www.linkedin.com/pulse/microsofts-ai-future-copilot-integration-quantum-path-girish-hukkeri-sh3pe",
  "Satya Nadella Era Part 2: From Cloud Leader to AI Powerhouse (2017-2025)": "https://www.linkedin.com/pulse/satya-nadella-era-part-2-from-cloud-leader-ai-girish-hukkeri-afv5e",
  "Satya Nadella Era Part 1: The Transformation Begins (2014-2017)": "https://www.linkedin.com/pulse/satya-nadella-era-part-1-transformation-begins-girish-hukkeri-geoce",
  "The Steve Ballmer and Interim Leadership Era: From Consolidation to Cloud Skepticism (2000-2013)": "https://www.linkedin.com/pulse/steve-ballmer-interim-leadership-era-from-cloud-girish-hukkeri-jozne",
  "The Bill Gates Era Part 3: Antitrust, Cloud Ambitions, and Gates' Transition (2000-2006)": "https://www.linkedin.com/pulse/bill-gates-era-part-3-antitrust-cloud-ambitions-girish-hukkeri-jydke",
  "Einstein: The Measure of Intelligence - The Ability to Change": "https://www.linkedin.com/pulse/einstein-measure-intelligence-ability-change-girish-hukkeri-4asae",
  "The Bill Gates Era Part 2: Windows Dominance and Personal Computing Revolution (1990-2000)": "https://www.linkedin.com/pulse/bill-gates-era-part-2-windows-dominance-personal-girish-hukkeri-jmane",
  "The Bill Gates Era Part 1: From Garage to Monopoly (1975-1990)": "https://www.linkedin.com/pulse/bill-gates-era-part-1-from-garage-monopoly-1975-1990-girish-hukkeri-klvde",
  "Alphabet's AI Future: Investments, Initiatives, and the Path to AGI and Beyond (2024-2030)": "https://www.linkedin.com/pulse/alphabets-ai-future-investments-initiatives-path-agi-beyond-hukkeri-m2pre",
  "The ChatGPT Wake-Up Call: Google's Response to OpenAI and the AI Arms Race (2017–2025)": "https://www.linkedin.com/pulse/chatgpt-wake-up-call-googles-response-openai-ai-arms-race-hukkeri-m6mye",
  "The DeepMind Acquisition and Early AI Initiatives: Google's Pivot to Artificial Intelligence (2011–2017)": "https://www.linkedin.com/pulse/deepmind-acquisition-early-ai-initiatives-googles-pivot-hukkeri-sdaxe",
  "Establishing Leadership: Google's Expansion and Product Ecosystem Dominance (2004–2014)": "https://www.linkedin.com/pulse/establishing-leadership-googles-expansion-product-20042014-hukkeri-yncxe",
  "Google Genesis: The BackRub Project to Search Engine Supremacy (1996–2004)": "https://www.linkedin.com/pulse/google-genesis-backrub-project-search-engine-19962004-girish-hukkeri-mlfje",
  "Bryan Hanson & Solventum: Architecting Healthcare Independence from the 3M Legacy": "https://www.linkedin.com/pulse/bryan-hanson-solventum-architecting-healthcare-from-3m-girish-hukkeri-hkt9e",
  "Alex Kendall: The Visionary Redefining Autonomous Mobility with Embodied Intelligence": "https://www.linkedin.com/pulse/alex-kendall-visionary-redefining-autonomous-mobility-girish-hukkeri-tt5ve",
  "Rick Klausner: The Polymath Pioneer Transforming Cancer Detection and Cellular Medicine": "https://www.linkedin.com/pulse/rick-klausner-polymath-pioneer-transforming-cancer-cellular-hukkeri-tur7e",
  "The Evolution of AI Models: Understanding Foundation, Frontier, and Emerging Architectures": "https://www.linkedin.com/pulse/evolution-ai-models-understanding-foundation-frontier-girish-hukkeri-mnp8f",
  "Jay Chaudhry: The Architect of Zero Trust Security": "https://www.linkedin.com/pulse/jay-chaudhry-architect-zero-trust-security-girish-hukkeri-ppcue",
  "Sridhar Ramaswamy: The Data Visionary Transforming Enterprise AI at Snowflake": "https://www.linkedin.com/pulse/sridhar-ramaswamy-data-visionary-transforming-ai-girish-hukkeri-mskbe",
  "Jensen Huang Beyond Nvidia: AI Investments, Philanthropy, and the Vision for Physical AI and Human-Digital Workforces": "https://www.linkedin.com/pulse/jensen-huang-beyond-nvidia-ai-investments-vision-physical-hukkeri-2uule",
  "Jeff Bezos' AI Empire: From Bezos Expeditions to Project Prometheus": "https://www.linkedin.com/pulse/jeff-bezos-ai-empire-from-expeditions-project-girish-hukkeri-ugf3e",
  "Bezos as Executive Chairman and the Vision for the Next Era (2021-Present)": "https://www.linkedin.com/pulse/bezos-executive-chairman-vision-next-era-2021present-girish-hukkeri-fjone",
  "AWS and the Cloud Revolution: From Internal Project to $51.5B Giant (2006–2021)": "https://www.linkedin.com/pulse/aws-cloud-revolution-from-internal-project-515b-giant-girish-hukkeri-o8zde",
  "Amazon's Global Expansion and E-Commerce Dominance (2001–2010): From Dot-Com Survivor to Retail Powerhouse": "https://www.linkedin.com/pulse/amazons-global-expansion-e-commerce-dominance-20012010-girish-hukkeri-jzi1e",
  "The New Architects of Innovation: Alfred Lin and Pat Grady Take the Helm at Sequoia Capital": "https://www.linkedin.com/pulse/new-architects-innovation-alfred-lin-pat-grady-take-helm-hukkeri-devie",
  "Jeff Bezos' Early Years and the Struggle to Build Amazon: The Visionary Who Bet Everything on Books and the Internet": "https://www.linkedin.com/pulse/jeff-bezos-early-years-struggle-build-amazon-who-bet-books-hukkeri-w7kce",
  "Nvidia's AI Era Dominance: The ChatGPT Catalyst and the Path to the World's Most Valuable Company": "https://www.linkedin.com/pulse/nvidias-ai-era-dominance-chatgpt-catalyst-path-worlds-girish-hukkeri-tnbme",
  "Nvidia's AI Foundation: From CUDA to the De Facto Standard Before ChatGPT": "https://www.linkedin.com/pulse/nvidias-ai-foundation-from-cuda-de-facto-standard-before-hukkeri-fqhve",
  "Nvidia's Gaming Dominance: The GeForce Revolution and the Rise of GPU Leadership": "https://www.linkedin.com/pulse/nvidias-gaming-dominance-geforce-revolution-rise-gpu-girish-hukkeri-vegwe",
  "Jensen Huang's GPU Vision: From Immigrant Dishwasher to Silicon Valley Visionary, The Founding and Survival of Nvidia": "https://www.linkedin.com/pulse/jensen-huangs-gpu-vision-from-immigrant-dishwasher-silicon-hukkeri-jsyqe",
  "Dr. Vik Bajaj: The Moonshot Architect Behind Project Prometheus": "https://www.linkedin.com/pulse/dr-vik-bajaj-moonshot-architect-behind-project-girish-hukkeri-bkjie",
  "Avery Pennarun & Tailscale: Engineering the New Internet Through Authenticity and Innovation": "https://www.linkedin.com/pulse/avery-pennarun-tailscale-engineering-new-internet-through-hukkeri-nblxe",
  "Applied Analysis of 8 AI Unicorns": "https://www.linkedin.com/pulse/applied-analysis-8-ai-unicorns-girish-hukkeri-1zwbf",
  "The AI Startup Ecosystem Bifurcates: Winners and Losers in the New Era": "https://www.linkedin.com/pulse/ai-startup-ecosystem-bifurcates-winners-losers-new-era-girish-hukkeri-94oje",
  "The AI Performance Paradox: How Market Leaders Are Dramatically Exceeding Projections While the \"Bubble Burst\" Narrative Persists": "https://www.linkedin.com/pulse/ai-performance-paradox-how-market-leaders-exceeding-while-hukkeri-ygvqe",
  "The Amodei Ascendancy: How Two Siblings Steered Anthropic from $183B to a Potential $350B Giant": "https://www.linkedin.com/pulse/amodei-ascendancy-how-two-siblings-steered-anthropic-from-hukkeri-3lu5e",
  "Marc Tessier-Lavigne and David Baker: The Visionaries Reshaping Drug Discovery at Xaira Therapeutics": "https://www.linkedin.com/pulse/marc-tessier-lavigne-david-baker-visionaries-drug-xaira-hukkeri-n6vte",
  "The Visionary Quartet Behind Cursor: How Four MIT Students Built a $29.3 Billion AI Empire": "https://www.linkedin.com/pulse/visionary-quartet-behind-cursor-how-four-mit-students-girish-hukkeri-eweye",
  "Apple After Steve Jobs: A Legacy Sustained, A Vision Expanded, and a Company Transformed": "https://www.linkedin.com/pulse/apple-after-steve-jobs-legacy-sustained-vision-expanded-hukkeri-pciqe",
  "Steve Jobs: The Phoenix Returns: Apple's Resurrection and a Legacy Sealed in Innovation": "https://www.linkedin.com/pulse/steve-jobs-phoenix-returns-apples-resurrection-legacy-girish-hukkeri-ajyye",
  "Steve Jobs: Pixar, Disney, and the Renaissance of Animation, The Visionary Years Between Exile and Return": "https://www.linkedin.com/pulse/steve-jobs-pixar-disney-renaissance-animation-years-between-hukkeri-zpgwe",
  "Steve Jobs: From Garage Dreams to Expulsion, the Genesis and Exodus of Apple's Revolutionary Founder": "https://www.linkedin.com/pulse/steve-jobs-from-garage-dreams-expulsion-genesis-exodus-girish-hukkeri-ozene",
  "Jerry Yang: From Yahoo! Pioneer to Silicon Valley Statesman": "https://www.linkedin.com/pulse/jerry-yang-from-yahoo-pioneer-silicon-valley-girish-hukkeri-vwnhe",
  "The Architect of Digital Transformation: Luca Ferrari's Blueprint for Building an All-Time Great Company": "https://www.linkedin.com/pulse/architect-digital-transformation-luca-ferraris-building-hukkeri-x2ace",
  "Ilkka Paananen: The Architect of Forever Games": "https://www.linkedin.com/pulse/ilkka-paananen-architect-forever-games-girish-hukkeri-jr6me",
  "Assaf Rappaport: The Architect of Cloud Security's Fastest Unicorn": "https://www.linkedin.com/pulse/assaf-rappaport-architect-cloud-securitys-fastest-unicorn-hukkeri-83tne",
  "Efe Cakarel of MUBI: Curating Cinema in the Age of Algorithms": "https://www.linkedin.com/pulse/efe-cakarel-mubi-curating-cinema-age-algorithms-girish-hukkeri-a747e",
  "Jake Loosararian: The Resilient Visionary Building Tomorrow's Infrastructure Intelligence": "https://www.linkedin.com/pulse/jake-loosararian-resilient-visionary-building-girish-hukkeri-tmtfe",
  "Shalev Hulio & Dream: From Offensive Cyber Operations to National Defense Strategy": "https://www.linkedin.com/pulse/shalev-hulio-dream-from-offensive-cyber-operations-national-hukkeri-zujue",
  "Anton Osika: The Swedish Physicist Democratizing Software Creation Through Lovable": "https://www.linkedin.com/pulse/anton-osika-swedish-physicist-democratizing-software-creation-girish-fy6ve",
  "Sameer Nigam: The Architect of India's Digital Payments Revolution": "https://www.linkedin.com/pulse/sameer-nigam-architect-indias-digital-payments-girish-hukkeri-i7v0e",
  "The Collison Brothers: Building the Economic Infrastructure of the Internet": "https://www.linkedin.com/pulse/collison-brothers-building-economic-infrastructure-internet-hukkeri-9y2le",
  "MoEngage: Crafting the Future of AI-Powered Customer Engagement Through Innovation and Visionary Leadership": "https://www.linkedin.com/pulse/moengage-crafting-future-ai-powered-customer-through-girish-hukkeri-rgq9e",
  "AI Bubble Burst : Why Instant Diffusion Makes It Irrelevant": "https://www.linkedin.com/pulse/ai-bubble-burst-why-instant-diffusion-makes-girish-hukkeri-iwwwe",
  "Christensen's Enduring Wisdom: Leveraging Disruptive Innovation Theory for the Journey to Unicorn Status and Beyond": "https://www.linkedin.com/pulse/christensens-enduring-wisdom-leveraging-disruptive-theory-hukkeri-exhde",
  "Niklas Zennström: The Visionary Who Connected the World and Revolutionized European Tech": "https://www.linkedin.com/pulse/niklas-zennström-visionary-who-connected-world-european-hukkeri-7n86e",
  "Giga AI: From IIT Kharagpur to AI's Customer Support Revolution": "https://www.linkedin.com/pulse/giga-ai-from-iit-kharagpur-ais-customer-support-girish-hukkeri-updue",
  "Transforming Retail Through Operational AI: How Deep Domain Models Drive Competitive Advantage ... And Prepare for AGI": "https://www.linkedin.com/pulse/transforming-retail-through-operational-ai-how-deep-domain-hukkeri-tamve",
  "i2u.ai: The Startup Ecosystem Booster, Transforming How Innovation Happens": "https://www.linkedin.com/pulse/i2uai-startup-ecosystem-booster-transforming-how-happens-hukkeri-qhtwe",
  "The RenAIssance Discontinuity: Why 50X Growth and Month-Long Unicorns Define the AGI Era": "https://www.linkedin.com/pulse/renaissance-discontinuity-why-50x-growth-month-long-unicorns-hukkeri-8cwbe",
  "The Visionary Builder: How Samir Vasavada is Redefining Wealth Management Through AI": "https://www.linkedin.com/pulse/visionary-builder-how-samir-vasavada-redefining-wealth-girish-hukkeri-igtre",
  "Dan Lorenc: Architect of Trust in the Software Supply Chain": "https://www.linkedin.com/pulse/dan-lorenc-architect-trust-software-supply-chain-girish-hukkeri-lruye",
  "Avery Pennarun: The Architect of Zero-Trust Networking Who Dreamed of Fixing the Internet": "https://www.linkedin.com/pulse/avery-pennarun-architect-zero-trust-networking-who-dreamed-hukkeri-qwy6e",
  "Liran Zvibel: The Architect Behind AI's Data Infrastructure Revolution": "https://www.linkedin.com/pulse/liran-zvibel-architect-behind-ais-data-infrastructure-girish-hukkeri-21cge",
  "Dave Rogenmoser, John Philip Morgan & Chris Hull: The Triumvirate Architects Behind Jasper AI's Ascent": "https://www.linkedin.com/pulse/dave-rogenmoser-john-philip-morgan-chris-hull-behind-jasper-hukkeri-ija2e",
  "The Visionary Architects of AI Infrastructure: Lukas Biewald and Chris Van Pelt Transform Machine Learning Operations": "https://www.linkedin.com/pulse/visionary-architects-ai-infrastructure-lukas-biewald-chris-hukkeri-jvuze",
  "From Dreams to Digital: The Saidov Brothers and Beamery's Rise to Unicorn Status": "https://www.linkedin.com/pulse/from-dreams-digital-saidov-brothers-beamerys-rise-unicorn-hukkeri-zcqxe",
  "Ron Daniel: The Visionary Architect Behind Liquidity Group's AI Revolution": "https://www.linkedin.com/pulse/ron-daniel-visionary-architect-behind-liquidity-groups-girish-hukkeri-wcrse",
  "Nicholas Harris: Engineering Light to Power the Future of AI": "https://www.linkedin.com/pulse/nicholas-harris-engineering-light-power-future-ai-girish-hukkeri-gzf8e",
  "Alex Bouaziz, Deel's Visionary CEO: Engineering the Global Workforce Revolution": "https://www.linkedin.com/pulse/alex-bouaziz-deels-visionary-ceo-engineering-global-girish-hukkeri-sz4se",
  "The Architects of Data Activation: Kashish Gupta and Tejas Manohar's Journey to Building Hightouch": "https://www.linkedin.com/pulse/architects-data-activation-kashish-gupta-tejas-manohars-hukkeri-s5aqe",
  "Mujeeb Ijaz of Our Next Energy: Visionary Leadership, Breakthroughs, and Impact": "https://www.linkedin.com/pulse/mujeeb-ijaz-our-next-energy-visionary-leadership-impact-hukkeri-py5ie",
  "Grant Demaree: Building OneBrief to Transform Military Decision-Making at the Speed of War": "https://www.linkedin.com/pulse/grant-demaree-building-onebrief-transform-military-speed-hukkeri-ammee",
  "Karandeep Anand: Architecting AI Entertainment's Next Chapter at Character.AI": "https://www.linkedin.com/pulse/karandeep-anand-architecting-ai-entertainments-next-chapter-hukkeri-1bqqe",
  "Iker Huerga: Pioneering the Future of AI-Enabled Drug Development": "https://www.linkedin.com/pulse/iker-huerga-pioneering-future-ai-enabled-drug-girish-hukkeri-xzxge",
  "Umesh Sachdev and Ravi Saraogi: Architecting Enterprise AI's Future": "https://www.linkedin.com/pulse/umesh-sachdev-ravi-saraogi-architecting-enterprise-ais-girish-hukkeri-saxje",
  "Visionary Leaders in the Age of AI-Native Data Security: Yotam Segev and Tamar Bar-Ilan Transform Enterprise Data Protection": "https://www.linkedin.com/pulse/visionary-leaders-age-ai-native-data-security-yotam-segev-hukkeri-bma8e",
  "Winston Weinberg: The Lawyer Who Built a $5 Billion AI Empire in Three Years": "https://www.linkedin.com/pulse/winston-weinberg-lawyer-who-built-5-billion-ai-empire-girish-hukkeri-3v4ue",
  "Xu Li: The Visionary Leading SenseTime's AI Revolution Through Innovation and Resilience": "https://www.linkedin.com/pulse/xu-li-visionary-leading-sensetimes-ai-revolution-through-hukkeri-j0gwe",
  "Sam Altman: Architecting the Future of AI Through Visionary Leadership": "https://www.linkedin.com/pulse/sam-altman-architecting-future-ai-through-visionary-girish-hukkeri-rkx6e",
  "Jack Hidary: Architecting the Quantum-AI Renaissance at SandboxAQ": "https://www.linkedin.com/pulse/jack-hidary-architecting-quantum-ai-renaissance-girish-hukkeri-d97be",
  "The Ocean of Intellect: Living in an Era of 1,000,000X (1Mx) Productivity, Now Onwards": "https://www.linkedin.com/pulse/ocean-intellect-living-era-1000000x-1mx-productivity-now-hukkeri-ihyke",
  "The Startup RenAIssance: How AI Transforms Global Entrepreneurship, Now Onwards!": "https://www.linkedin.com/pulse/startup-renaissance-how-ai-transforms-global-now-onwards-hukkeri-ab8ge",
  "The AI Era: The Fastest Diffusion of a General Purpose Technology (GPT)": "https://www.linkedin.com/pulse/ai-era-fastest-diffusion-general-purpose-technology-gpt-hukkeri-n7fme",
  "The Autonomous Internet: When AI Agents Run Every Digital Touchpoint in Our Connected World": "https://www.linkedin.com/pulse/autonomous-internet-when-ai-agents-run-every-digital-our-hukkeri-lcsge",
  "The AI Agent Revolution: A Comprehensive Analysis of Global Workforce Transformation and Market Demand (2025-2045)": "https://www.linkedin.com/pulse/ai-agent-revolution-comprehensive-analysis-global-market-hukkeri-3bqee",
  "The Architect of the Web's Future: Guillermo Rauch's Journey from Buenos Aires to Silicon Valley's Pinnacle": "https://www.linkedin.com/pulse/architect-webs-future-guillermo-rauchs-journey-from-buenos-hukkeri-cfsfe",
  "Arthur Mensch: Architecting Europe's AI Renaissance Through Open Innovation": "https://www.linkedin.com/pulse/arthur-mensch-architecting-europes-ai-renaissance-through-hukkeri-5thwe",
  "The Mercor Triad: How Three 22-Year-Old Debate Champions Built the Fastest-Growing Company in History": "https://www.linkedin.com/pulse/mercor-triad-how-three-22-year-old-debate-champions-built-hukkeri-mgs9e",
  "Yan Junjie: The AI Visionary Redefining China's Path to Artificial General Intelligence": "https://www.linkedin.com/pulse/yan-junjie-ai-visionary-redefining-chinas-path-general-girish-hukkeri-ozbge",
  "Daphne Koller: Pioneering the Future of AI-Driven Drug Discovery Through Insitro": "https://www.linkedin.com/pulse/daphne-koller-pioneering-future-ai-driven-drug-through-girish-hukkeri-xosee",
  "Hosam Arab: The Visionary Leading Tabby's Revolutionary Transformation of Middle East Finance": "https://www.linkedin.com/pulse/hosam-arab-visionary-leading-tabbys-revolutionary-middle-hukkeri-4iwve",
  "Vishal Marria: The Architect of Decision Intelligence": "https://www.linkedin.com/pulse/vishal-marria-architect-decision-intelligence-girish-hukkeri-ttfcf",
  "Pioneering the Future of AI-Driven Software Development: An In-Depth Assessment of Jason Warner and Eiso Kant's Revolutionary Journey at Poolside": "https://www.linkedin.com/pulse/pioneering-future-ai-driven-software-development-in-depth-hukkeri-yeeye",
  "The Architect of Programmable IP: Seung Yoon Lee's Vision for Creator Rights in the AI Era": "https://www.linkedin.com/pulse/architect-programmable-ip-seung-yoon-lees-vision-creator-hukkeri-n2yze",
  "The Virani Brothers: Architects of India's Snack Empire": "https://www.linkedin.com/pulse/virani-brothers-architects-indias-snack-empire-girish-hukkeri-xpbke",
  "John Imah: The Visionary Architect Reshaping Fashion's AI Frontier": "https://www.linkedin.com/pulse/john-imah-visionary-architect-reshaping-fashions-ai-frontier-hukkeri-39rre",
  "Visionary Disruptors: The Triad Transforming India's Wealth Management Landscape": "https://www.linkedin.com/pulse/visionary-disruptors-triad-transforming-indias-wealth-girish-hukkeri-gxqte",
  "The Visionary Duo Behind Writer: May Habib and Waseem AlShikh Transform Enterprise AI": "https://www.linkedin.com/pulse/visionary-duo-behind-writer-may-habib-waseem-alshikh-ai-hukkeri-sdtue",
  "The Sakana AI Triumvirate: Pioneering Nature-Inspired AI in Japan": "https://www.linkedin.com/pulse/sakana-ai-triumvirate-pioneering-nature-inspired-japan-girish-hukkeri-mkoqe",
  "Viswa Colluru: The Architect of Nature's Digital Renaissance": "https://www.linkedin.com/pulse/viswa-colluru-architect-natures-digital-renaissance-girish-hukkeri-nt84e",
  "Tuhin Srivastava: Building the Foundation of AI's Future": "https://www.linkedin.com/pulse/tuhin-srivastava-building-foundation-ais-future-girish-hukkeri-tyahe",
  "Munjal Shah: The Visionary Architect of Healthcare AI Revolution": "https://www.linkedin.com/pulse/munjal-shah-visionary-architect-healthcare-ai-girish-hukkeri-ofs2e",
  "David Luan: The Visionary Architect of Artificial General Intelligence": "https://www.linkedin.com/pulse/david-luan-visionary-architect-artificial-general-girish-hukkeri-xbwxe",
  "Kevin Czinger: The Visionary Architect of Tomorrow's Manufacturing Revolution": "https://www.linkedin.com/pulse/kevin-czinger-visionary-architect-tomorrows-girish-hukkeri-qk1ne",
  "The Balaban Brothers: Twin Visionaries Powering the AI Revolution Through Lambda Labs": "https://www.linkedin.com/pulse/balaban-brothers-twin-visionaries-powering-ai-through-girish-hukkeri-v0cff",
  "The Fintech Architects: V.R. Govindarajan and Debasish Chakraborty Transform India's Financial Infrastructure Through Perfios": "https://www.linkedin.com/pulse/fintech-architects-vr-govindarajan-debasish-transform-girish-hukkeri-iqj6e",
  "The Visionary Architects: Ivan Zhao and Simon Last's Revolutionary Journey at Notion": "https://www.linkedin.com/pulse/visionary-architects-ivan-zhao-simon-lasts-journey-notion-hukkeri-jytee",
  "The Visionary Architect of Tomorrow: Bernt Børnich and the Humanoid Revolution at 1X Technologies": "https://www.linkedin.com/pulse/visionary-architect-tomorrow-bernt-børnich-humanoid-1x-girish-hukkeri-axxfe",
  "Edwin Chen: The Quiet Genius Who Built AI's Most Essential Empire": "https://www.linkedin.com/pulse/edwin-chen-quiet-genius-who-built-ais-most-essential-empire-hukkeri-x4vhe",
  "Jan Koum: The Privacy Pioneer Who Built WhatsApp Through Adversity": "https://www.linkedin.com/pulse/jan-koum-privacy-pioneer-who-built-whatsapp-through-girish-hukkeri-epkle",
  "The Modern Titans of Defense Tech: Palmer Luckey & Brian Schimpf Forge the Future of National Security": "https://www.linkedin.com/pulse/modern-titans-defense-tech-palmer-luckey-brian-schimpf-girish-hukkeri-3jsie",
  "Brett Adcock of Archer Aviation: Engineering Tomorrow's Sky Through Bold Vision and Strategic Leadership": "https://www.linkedin.com/pulse/brett-adcock-archer-aviation-engineering-tomorrows-sky-girish-hukkeri-begze",
  "The Architect of Modern AI Networking: Jayashree Ullal's Transformational Leadership at Arista Networks": "https://www.linkedin.com/pulse/architect-modern-ai-networking-jayashree-ullals-arista-girish-hukkeri-vsywe",
  "Munir Machmud Ali: The Data Intelligence Visionary Reshaping Indonesia's Tech Landscape": "https://www.linkedin.com/pulse/munir-machmud-ali-data-intelligence-visionary-tech-girish-hukkeri-dvrxe",
  "Jeffrey Cardenas: The Visionary Architect of Humanoid Robotics": "https://www.linkedin.com/pulse/jeffrey-cardenas-visionary-architect-humanoid-robotics-girish-hukkeri-k1hve",
  "The Burrito Pioneer: How Bert Mueller Built India's Most Beloved Mexican Food Empire": "https://www.linkedin.com/pulse/burrito-pioneer-how-bert-mueller-built-indias-most-beloved-hukkeri-q78ke",
  "The Streaming Visionary: Anthony Wood's Journey from Dorm Room Dreams to Roku Empire": "https://www.linkedin.com/pulse/streaming-visionary-anthony-woods-journey-from-dorm-room-hukkeri-w2jne",
  "The Kantara Visionary: Rishab Shetty's Revolutionary Journey Through the Lens of Entrepreneurial Excellence": "https://www.linkedin.com/pulse/kantara-visionary-rishab-shettys-revolutionary-journey-girish-hukkeri-toc7e",
  "Brett Adcock: The Visionary Architect of AI's Physical Future": "https://www.linkedin.com/pulse/brett-adcock-visionary-architect-ais-physical-future-girish-hukkeri-c1dfe",
  "Visionary Leadership in Humanoid Robotics: The Strategic Excellence of Peggy Johnson and Paras Velegapudi at Agility Robotics": "https://www.linkedin.com/pulse/visionary-leadership-humanoid-robotics-strategic-peggy-girish-hukkeri-ucwde",
  "Victor Riparbelli: The Visionary Architect of AI-Powered Video Revolution": "https://www.linkedin.com/pulse/victor-riparbelli-visionary-architect-ai-powered-video-girish-hukkeri-g8xbe",
  "The Visionaries of Wall Street Democracy: Vlad Tenev & Baiju Bhatt": "https://www.linkedin.com/pulse/visionaries-wall-street-democracy-vlad-tenev-baiju-bhatt-hukkeri-unvwe",
  "The Visionary Behind Spatial Intelligence: Fei-Fei Li's Revolutionary Journey with World Labs": "https://www.linkedin.com/pulse/visionary-behind-spatial-intelligence-fei-fei-lis-journey-hukkeri-rqzke",
  "The Visionary Architects of AI's Future: Ramin Hasani and Mathias Lechner of Liquid AI": "https://www.linkedin.com/pulse/visionary-architects-ais-future-ramin-hasani-mathias-lechner-hukkeri-qoqwe",
  "Karol Hausman of Physical Intelligence: Charting the Future of Robotic Intelligence": "https://www.linkedin.com/pulse/karol-hausman-physical-intelligence-charting-future-robotic-hukkeri-svw2e",
  "Tom Siebel: Vision Architect of Enterprise AI": "https://www.linkedin.com/pulse/tom-siebel-vision-architect-enterprise-ai-girish-hukkeri-u2oee",
  "The Bezos Blueprint: A Visionary's Journey from Garage Startup to Global Empire": "https://www.linkedin.com/pulse/bezos-blueprint-visionarys-journey-from-garage-startup-girish-hukkeri-ujvte",
  "The Architect of Apple: Steve Jobs' Struggle, Triumph, and the Path Forward": "https://www.linkedin.com/pulse/architect-apple-steve-jobs-struggle-triumph-path-forward-hukkeri-ga3he",
  "The Visionary Duo: Kyle Vogt and Paril Jain's Revolutionary Robotics Journey": "https://www.linkedin.com/pulse/visionary-duo-kyle-vogt-paril-jains-revolutionary-robotics-hukkeri-jfeke",
  "The Skild Duo: How Deepak Pathak and Abhinav Gupta are Building the Future of Robotics Intelligence": "https://www.linkedin.com/pulse/skild-duo-how-deepak-pathak-abhinav-gupta-building-future-hukkeri-a13he",
  "The Visionaries Behind Decagon: Jesse Zhang and Ashwin Sreenivas Redefining AI Customer Experience": "https://www.linkedin.com/pulse/visionaries-behind-decagon-jesse-zhang-ashwin-ai-customer-hukkeri-zbawe",
  "The Dynamic Duo Revolutionizing Drug Discovery: Chris Gibson and Dean Li's AI-Powered Vision at Recursion Pharmaceuticals": "https://www.linkedin.com/pulse/dynamic-duo-revolutionizing-drug-discovery-chris-gibson-hukkeri-up5oe",
  "The AI Native Visionaries: Arjun Prakash and Derek Ho's Revolutionary Journey with Distyl AI": "https://www.linkedin.com/pulse/ai-native-visionaries-arjun-prakash-derek-hos-journey-girish-hukkeri-kyede",
  "The Visionaries Behind the Light: David Lazovsky and Preet Virk's Revolutionary Journey with Celestial AI": "https://www.linkedin.com/pulse/visionaries-behind-light-david-lazovsky-preet-virks-journey-hukkeri-08p4e",
  "The Architect of AI Infrastructure: Rochan Sankar's Journey from Silicon Dreams to Nvidia's $900 Million Bet": "https://www.linkedin.com/pulse/architect-ai-infrastructure-rochan-sankars-journey-from-hukkeri-u1cwe",
  "Celonis: The Process Intelligence Pioneer Transforming Enterprise Operations at Scale": "https://www.linkedin.com/pulse/celonis-process-intelligence-pioneer-transforming-scale-hukkeri-yunee",
  "The Polymath Pioneers: How Daniel Nadler and Zachary Ziegler are Revolutionizing Medical Knowledge through AI": "https://www.linkedin.com/pulse/polymath-pioneers-how-daniel-nadler-zachary-ziegler-medical-hukkeri-egise",
  "The Saronic Quartet: Maritime Visionaries Redefining Naval Defense": "https://www.linkedin.com/pulse/saronic-quartet-maritime-visionaries-redefining-naval-girish-hukkeri-u19le",
  "Jensen Huang: The Visionary Who Transformed Computing and Redefined Leadership": "https://www.linkedin.com/pulse/jensen-huang-visionary-who-transformed-computing-girish-hukkeri-kwa9e",
  "The Visionary Behind the Wheel: Avneesh Agrawal and Netradyne's AI-Powered Revolution in Fleet Safety": "https://www.linkedin.com/pulse/visionary-behind-wheel-avneesh-agrawal-netradynes-fleet-hukkeri-6eh7e",
  "The VideoVerse Visionaries: Transforming AI-Powered Video Technology": "https://www.linkedin.com/pulse/videoverse-visionaries-transforming-ai-powered-video-girish-hukkeri-wrehe",
  "Mira Murati and Thinking Machines Lab: Pioneering Human-Centric Frontier AI": "https://www.linkedin.com/pulse/mira-murati-thinking-machines-lab-pioneering-frontier-girish-hukkeri-dksne",
  "The Moonshot Visionary: Yang Zhilin - Pioneering China's AI Renaissance": "https://www.linkedin.com/pulse/moonshot-visionary-yang-zhilin-pioneering-chinas-ai-girish-hukkeri-nodhe",
  "Dr. Shiv Rao: The Cardiologist-CEO Transforming Healthcare with AI": "https://www.linkedin.com/pulse/dr-shiv-rao-cardiologist-ceo-transforming-healthcare-ai-hukkeri-c59fe",
  "The Moveworks Quartet: How 4 Visionaries Built a $2.85 Billion AI Empire": "https://www.linkedin.com/pulse/moveworks-quartet-how-4-visionaries-built-285-billion-girish-hukkeri-hqpee",
  "The Glean Quartet: Visionary Leadership Transforming Enterprise AI": "https://www.linkedin.com/pulse/glean-quartet-visionary-leadership-transforming-ai-girish-hukkeri-66ose",
  "The Visionary Quartet Behind Cursor AI": "https://www.linkedin.com/pulse/visionary-quartet-behind-cursor-ai-girish-hukkeri-3pwze",
  "From Mathematics to Market Mastery: The Fractal Analytics Trinity": "https://www.linkedin.com/pulse/from-mathematics-market-mastery-fractal-analytics-trinity-hukkeri-jbxce",
  "The Grammarly Triumvirate: How Three Ukrainian Visionaries Built a $13 Billion AI Empire": "https://www.linkedin.com/pulse/grammarly-triumvirate-how-three-ukrainian-visionaries-girish-hukkeri-lwofe",
  "Tim Schumacher: The Domain Visionary Who Became Europe's Climate Tech Champion": "https://www.linkedin.com/pulse/tim-schumacher-domain-visionary-who-became-europes-climate-hukkeri-agwge",
  "The Automation Architects: How Daniel Dines, Marius Tîrcă & Rahul Sood Built UiPath's $36 Billion Empire": "https://www.linkedin.com/pulse/automation-architects-how-daniel-dines-marius-tîrcă-rahul-hukkeri-80uae",
  "The Meteoric Rise of Michael Intrator: From Wall Street Trader to AI Empire Builder": "https://www.linkedin.com/pulse/meteoric-rise-michael-intrator-from-wall-street-trader-girish-hukkeri-z3ule",
  "The Visionary Behind the $100+ Billion Data Revolution": "https://www.linkedin.com/pulse/professional-portrait-ali-ghodsi-ceo-databricks-suitable-hukkeri-zibue",
  "The Amodei Siblings: Transforming AI Through Constitutional Innovation": "https://www.linkedin.com/pulse/amodei-siblings-transforming-ai-through-innovation-girish-hukkeri-shmse",
  "The Visionary Who Democratized Design: Melanie Perkins' Extraordinary Journey": "https://www.linkedin.com/pulse/visionary-who-democratized-design-melanie-perkins-journey-hukkeri-ub6be",
  "Liang Wenfeng: The Maverick Who Disrupted AI with DeepSeek": "https://www.linkedin.com/pulse/liang-wenfeng-maverick-who-disrupted-ai-deepseek-girish-hukkeri-krdoe",
  "Ilya Sutskever: The Neural Network Visionary Who Architected the AI Revolution": "https://www.linkedin.com/pulse/ilya-sutskever-neural-network-visionary-who-ai-girish-hukkeri-tcjye",
  "Zhang Yiming and Liang Rubo: The ByteDance Revolution": "https://www.linkedin.com/pulse/zhang-yiming-liang-rubo-bytedance-revolution-girish-hukkeri-deiae",
  "The RenAIssance: How AI Is Orchestrating Humanity's Greatest Innovation, Renaissance": "https://www.linkedin.com/pulse/renaissance-how-ai-orchestrating-humanitys-greatest-girish-hukkeri-dz1ne",
  "Catalyzing the Hyper-Unicorn Era: How AI-First Ecosystems Are Turning Founders into Global Game-Changers": "https://www.linkedin.com/pulse/catalyzing-hyper-unicorn-era-how-ai-first-ecosystems-turning-hukkeri-dkeje",
  "The AI Era: Humanity's Multiverse Bang": "https://www.linkedin.com/pulse/ai-era-humanitys-multiverse-bang-girish-hukkeri-lan4e",
  "Breaking the Intelligence Singularity: From Steve Jobs' Leadership Paradox to Consciousness-Enabled AI Systems - Part 2": "https://www.linkedin.com/pulse/breaking-intelligence-singularity-from-steve-jobs-paradox-hukkeri-ykxle",
  "Breaking the Intelligence Singularity: From Steve Jobs' Leadership Paradox to Consciousness-Enabled AI Systems - Part 1": "https://www.linkedin.com/pulse/breaking-intelligence-singularity-from-steve-jobs-paradox-hukkeri-k2xqe",
  "AI Unicorns & Soonicorns: The $1.1 Trillion AI Revolution Reshaping Global Business": "https://www.linkedin.com/pulse/ai-unicorns-soonicorns-11-trillion-revolution-global-business-girish-jvcne",
  "Alexandr Wang: From Math Prodigy to Meta's AI Visionary": "https://www.linkedin.com/pulse/alexandr-wang-from-math-prodigy-metas-ai-visionary-girish-hukkeri-wyooe",
  "Aravind Srinivas: From IIT Chennai to the Forefront of AI Search Revolution": "https://www.linkedin.com/pulse/aravind-srinivas-from-iit-chennai-forefront-ai-search-girish-hukkeri-otiwe",
  "Demis Hassabis: From Chess Prodigy to Nobel Laureate": "https://www.linkedin.com/pulse/demis-hassabis-from-chess-prodigy-nobel-laureate-girish-hukkeri-1rdpe",
  "Eric Lefkofsky: The Serial Entrepreneur Revolutionizing Precision Medicine": "https://www.linkedin.com/pulse/copy-eric-lefkofsky-serial-entrepreneur-precision-medicine-hukkeri-qxike",
  "Gaming Riddle: Unleashing India's Cognitive Economy?": "https://www.linkedin.com/pulse/gaming-riddle-unleashing-indias-cognitive-economy-girish-hukkeri-fysye",
  "Kareem Amin & Varun Anand: The Visionary Duo Revolutionizing Go-to-Market with Clay AI": "https://www.linkedin.com/pulse/kareem-amin-varun-anand-visionary-duo-revolutionizing-girish-hukkeri-eraoe",
  "Matt Zeiler: The Visionary Behind Clarifai's AI Revolution": "https://www.linkedin.com/pulse/matt-zeiler-visionary-behind-clarifais-ai-revolution-girish-hukkeri-c6mje",
  "Nikita Bier: The Master of Viral App Creation and the Future of Growth": "https://www.linkedin.com/pulse/nikita-bier-master-viral-app-creation-future-growth-girish-hukkeri-kdhhe",
  "Scott Wu: The Mathematical Prodigy Revolutionizing AI Software Engineering": "https://www.linkedin.com/pulse/scott-wu-mathematical-prodigy-revolutionizing-ai-software-hukkeri-rsefe",
  "Suzanne Gildert: Pioneer of Conscious AI Revolution": "https://www.linkedin.com/pulse/suzanne-gildert-pioneer-conscious-ai-revolution-girish-hukkeri-r6vfe",
  "The Evolution of Industry: From Steam Power to Quantum Intelligence": "https://www.linkedin.com/pulse/evolution-industry-from-steam-power-quantum-girish-hukkeri-hpxie",
  "The Great AI Paradox: When Innovation Meets the Reality of Implementation": "https://www.linkedin.com/pulse/great-ai-paradox-when-innovation-meets-reality-girish-hukkeri-ohz5e",
  "The Great AI Reckoning: When Innovation Meets Reality in the Age of AI": "https://www.linkedin.com/pulse/great-ai-reckoning-when-innovation-meets-reality-age-girish-hukkeri-m8y6e",
  "The Great Acceleration": "https://www.linkedin.com/pulse/great-acceleration-girish-hukkeri-islce",
  "The Great Leveling: How Agentic AI Is Rewriting the Rules of Digital Dominance": "https://www.linkedin.com/pulse/great-leveling-how-agentic-ai-rewriting-rules-digital-girish-hukkeri-75ree",
  "The Helsing Trinity: Architects of Europe's AI Defense Revolution": "https://www.linkedin.com/pulse/helsing-trinity-architects-europes-ai-defense-girish-hukkeri-7zvqe",
  "The Innovation Spawning": "https://www.linkedin.com/pulse/innovation-spawning-girish-hukkeri-tefve",
  "The Intelligence Convergence: How 2025 Became the Year Everything Changed": "https://www.linkedin.com/pulse/intelligence-convergence-how-2025-became-year-changed-girish-hukkeri-x1hme",
  "The Intelligence Convergence: When Every Human Becomes a Superpower": "https://www.linkedin.com/pulse/intelligence-convergence-when-every-human-becomes-girish-hukkeri-sef7e",
  "The Opportunity Revolution: The Greatest Democratization of Wealth Creation": "https://www.linkedin.com/pulse/opportunity-revolution-greatest-democratization-wealth-girish-hukkeri-ur6ye",
  "The Pioneering Leaders Revolutionizing Mineral Exploration: Kurt House, Josh Goldman, and Mfikeyi Makayi of KoBold Metals": "https://www.linkedin.com/pulse/visionary-leaders-revolutionizing-mineral-exploration-girish-hukkeri-fwbae",
  "The Productive Man-Years Revolution: How AI is Redefining History's Greatest Demographic Shift": "https://www.linkedin.com/pulse/productive-man-years-revolution-how-ai-redefining-historys-hukkeri-945ye",
  "The RenAIssance Revolution: How Organic AI, Quantum Computing & Nuclear Breakthroughs are Orchestrating Renaissance": "https://www.linkedin.com/pulse/renaissance-revolution-how-organic-ai-quantum-nuclear-girish-hukkeri-iidre",
  "The Strategic Awakening: Legacy Giants Face the Agentic AI Revolution": "https://www.linkedin.com/pulse/strategic-awakening-legacy-giants-face-agentic-ai-girish-hukkeri-ies6f",
  "The Trinity of Innovation: Mustafa Suleyman, Karén Simonyan, and Reid Hoffman's Journey Through AI's Next Frontier": "https://www.linkedin.com/pulse/trinity-innovation-mustafa-suleyman-kar%C3%A9n-simonyan-reid-hukkeri-9bvre",
  "The Velocity Revolution: How AI is Reshaping Global Competition": "https://www.linkedin.com/pulse/velocity-revolution-how-ai-reshaping-global-girish-hukkeri-7qzhe",
  "The Venture Capital Titan: Sequoia Capital Through the Lens of Strategic Excellence": "https://www.linkedin.com/pulse/venture-capital-titan-sequoia-through-lens-strategic-girish-hukkeri-n1gle",
  "The Visionary Duo Democratizing AI: Vipul Ved Prakash & Ce Zhang of Together AI": "https://www.linkedin.com/pulse/visionary-duo-democratizing-ai-vipul-ved-prakash-ce-zhang-hukkeri-dfnge",
  "The Visionary Duo: Varun Mohan and Douglas Chen's Journey to AI Coding Supremacy": "https://www.linkedin.com/pulse/visionary-duo-varun-mohan-douglas-chens-journey-ai-coding-hukkeri-ymdxe",
  "The Visionary Triad: How Jeremy Achin, Tom De Godoy, and Debanjan Saha are Democratizing AI Through DataRobot": "https://www.linkedin.com/pulse/visionary-triad-how-jeremy-achin-tom-de-godoy-debanjan-girish-hukkeri-g7xse",
  "The Visionary Trio Behind Runway AI: Revolutionizing Creative Technology Through Generative Intelligence": "https://www.linkedin.com/pulse/visionary-trio-behind-runway-ai-revolutionizing-creative-hukkeri-buhde",
  "The Voice Visionaries: Mati Staniszewski and Piotr Dąbkowski Revolutionizing AI Audio": "https://www.linkedin.com/pulse/voice-visionaries-mati-staniszewski-piotr-d%C4%85bkowski-ai-girish-hukkeri-rhaqe",
  "Vision, Ingenuity, and Industry: The Simon Kalouche & Nimble Story": "https://www.linkedin.com/pulse/vision-ingenuity-industry-simon-kalouche-nimble-story-girish-hukkeri-33gie",
  "When Tier-1 VC Validation Becomes Ecosystem Fuel": "https://www.linkedin.com/pulse/when-tier-1-vc-validation-becomes-ecosystem-fuel-girish-hukkeri-dtzme"
};

const defaultLinkedInUrl = "https://www.linkedin.com/newsletters/i2u-ai-blog-7359775076067467264/";

const allArticles = [
  "Danny Auble: The Architect of Open-Source HPC Innovation Leading SchedMD into the NVIDIA Era",
  "Genesis of IBM and Thomas Watson Sr.: From Computing-Tabulating-Recording to Computing Dominance (1896–1956)",
  "Beyond Labels: Weak and Self-Supervised Learning as the Path to Unlimited Data and Scalable AI",
  "DevRev: Bridging the Developer-Customer Gap and Reshaping the Enterprise CRM Market",
  "Zeroth Principles Extended Series",
  "The Seven-Year-Old Test: Building Artificial Common Sense as the Foundation for General Intelligence",
  "Niccolo de Masi: The Physicist-CEO Leading IonQ's Quantum Revolution",
  "From Prediction to Understanding: Causal Inference as the Gateway to True AI",
  "Dheeraj Pandey: The Architect of Hybrid Cloud Infrastructure and the Visionary Reshaping Enterprise IT",
  "Zeroth Principles - Part Two: AI as Spectacle, Humanity's Infinite Mirror",
  "Meta's AI Present and Future: Llama, AGI, and the 2025-'30 Vision",
  "Zeroth Principles - Part One: The Insight Precedes the Invention",
  "Meta's Mobile Revolution and Advertising Dominance (2012-'18)",
  "Building Artificial Minds: World Models and Cognitive Development as the Path to AGI",
  "Meta's Metaverse Pivot and Reality Labs Investment (2019-'23)",
  "Physics-Informed Machine Learning: Embedding the Laws of Nature into AI",
  "Meta's Genesis: From Harvard Dorm to Social Media Empire (2004-2012)",
  "The AI Spring and the Lingering Winter: Beyond Pattern Recognition to Understanding Unknown Laws",
  "Entertainment in the AI Era: Generative Content, Personalization, and Future Models (2025-'30)",
  "Streaming Wars, Password Sharing Crackdown, and Profitability Focus (2015-2025)",
  "Netflix Origins and DVD Disruption (1997-2005)",
  "Netflix Acquires Warner Bros. Discovery: The Entertainment Industry Consolidation Catalyst (December 2025)",
  "Jacob DeWitte & Caroline Cochran: Building the Nuclear Renaissance Through Oklo Inc.",
  "Monte Carlo Simulation and Its Impact on AI",
  "Rajeeb (Raj) Hazra: The Architect Behind Quantinuum's Quantum Revolution",
  "Microsoft's AI Future: Copilot Integration, Quantum Computing, AI Infrastructure, and Path to AGI (2025-2035)",
  "Satya Nadella Era Part 2: From Cloud Leader to AI Powerhouse (2017-2025)",
  "Satya Nadella Era Part 1: The Transformation Begins (2014-2017)",
  "The Steve Ballmer and Interim Leadership Era: From Consolidation to Cloud Skepticism (2000-2013)",
  "The Bill Gates Era Part 3: Antitrust, Cloud Ambitions, and Gates' Transition (2000-2006)",
  "Einstein: The Measure of Intelligence - The Ability to Change",
  "The Bill Gates Era Part 2: Windows Dominance and Personal Computing Revolution (1990-2000)",
  "The Bill Gates Era Part 1: From Garage to Monopoly (1975-1990)",
  "Alphabet's AI Future: Investments, Initiatives, and the Path to AGI and Beyond (2024-2030)",
  "The ChatGPT Wake-Up Call: Google's Response to OpenAI and the AI Arms Race (2017–2025)",
  "The DeepMind Acquisition and Early AI Initiatives: Google's Pivot to Artificial Intelligence (2011–2017)",
  "Establishing Leadership: Google's Expansion and Product Ecosystem Dominance (2004–2014)",
  "Google Genesis: The BackRub Project to Search Engine Supremacy (1996–2004)",
  "Bryan Hanson & Solventum: Architecting Healthcare Independence from the 3M Legacy",
  "Alex Kendall: The Visionary Redefining Autonomous Mobility with Embodied Intelligence",
  "Rick Klausner: The Polymath Pioneer Transforming Cancer Detection and Cellular Medicine",
  "The Evolution of AI Models: Understanding Foundation, Frontier, and Emerging Architectures",
  "Jay Chaudhry: The Architect of Zero Trust Security",
  "Sridhar Ramaswamy: The Data Visionary Transforming Enterprise AI at Snowflake",
  "Jensen Huang Beyond Nvidia: AI Investments, Philanthropy, and the Vision for Physical AI and Human-Digital Workforces",
  "Jeff Bezos' AI Empire: From Bezos Expeditions to Project Prometheus",
  "Bezos as Executive Chairman and the Vision for the Next Era (2021-Present)",
  "AWS and the Cloud Revolution: From Internal Project to $51.5B Giant (2006–2021)",
  "Amazon's Global Expansion and E-Commerce Dominance (2001–2010): From Dot-Com Survivor to Retail Powerhouse",
  "The New Architects of Innovation: Alfred Lin and Pat Grady Take the Helm at Sequoia Capital",
  "Jeff Bezos' Early Years and the Struggle to Build Amazon: The Visionary Who Bet Everything on Books and the Internet",
  "Nvidia's AI Era Dominance: The ChatGPT Catalyst and the Path to the World's Most Valuable Company",
  "Nvidia's AI Foundation: From CUDA to the De Facto Standard Before ChatGPT",
  "Nvidia's Gaming Dominance: The GeForce Revolution and the Rise of GPU Leadership",
  "Jensen Huang's GPU Vision: From Immigrant Dishwasher to Silicon Valley Visionary, The Founding and Survival of Nvidia",
  "Dr. Vik Bajaj: The Moonshot Architect Behind Project Prometheus",
  "Avery Pennarun & Tailscale: Engineering the New Internet Through Authenticity and Innovation",
  "Applied Analysis of 8 AI Unicorns",
  "The AI Startup Ecosystem Bifurcates: Winners and Losers in the New Era",
  "The AI Performance Paradox: How Market Leaders Are Dramatically Exceeding Projections While the \"Bubble Burst\" Narrative Persists",
  "The Amodei Ascendancy: How Two Siblings Steered Anthropic from $183B to a Potential $350B Giant",
  "Marc Tessier-Lavigne and David Baker: The Visionaries Reshaping Drug Discovery at Xaira Therapeutics",
  "The Visionary Quartet Behind Cursor: How Four MIT Students Built a $29.3 Billion AI Empire",
  "Apple After Steve Jobs: A Legacy Sustained, A Vision Expanded, and a Company Transformed",
  "Steve Jobs: The Phoenix Returns: Apple's Resurrection and a Legacy Sealed in Innovation",
  "Steve Jobs: Pixar, Disney, and the Renaissance of Animation, The Visionary Years Between Exile and Return",
  "Steve Jobs: From Garage Dreams to Expulsion, the Genesis and Exodus of Apple's Revolutionary Founder",
  "Jerry Yang: From Yahoo! Pioneer to Silicon Valley Statesman",
  "The Architect of Digital Transformation: Luca Ferrari's Blueprint for Building an All-Time Great Company",
  "Ilkka Paananen: The Architect of Forever Games",
  "Assaf Rappaport: The Architect of Cloud Security's Fastest Unicorn",
  "Efe Cakarel of MUBI: Curating Cinema in the Age of Algorithms",
  "Jake Loosararian: The Resilient Visionary Building Tomorrow's Infrastructure Intelligence",
  "Shalev Hulio & Dream: From Offensive Cyber Operations to National Defense Strategy",
  "Anton Osika: The Swedish Physicist Democratizing Software Creation Through Lovable",
  "Sameer Nigam: The Architect of India's Digital Payments Revolution",
  "The Collison Brothers: Building the Economic Infrastructure of the Internet",
  "MoEngage: Crafting the Future of AI-Powered Customer Engagement Through Innovation and Visionary Leadership",
  "AI Bubble Burst : Why Instant Diffusion Makes It Irrelevant",
  "Christensen's Enduring Wisdom: Leveraging Disruptive Innovation Theory for the Journey to Unicorn Status and Beyond",
  "Niklas Zennström: The Visionary Who Connected the World and Revolutionized European Tech",
  "Giga AI: From IIT Kharagpur to AI's Customer Support Revolution",
  "Transforming Retail Through Operational AI: How Deep Domain Models Drive Competitive Advantage ... And Prepare for AGI",
  "i2u.ai: The Startup Ecosystem Booster, Transforming How Innovation Happens",
  "The RenAIssance Discontinuity: Why 50X Growth and Month-Long Unicorns Define the AGI Era",
  "The Visionary Builder: How Samir Vasavada is Redefining Wealth Management Through AI",
  "Dan Lorenc: Architect of Trust in the Software Supply Chain",
  "Avery Pennarun: The Architect of Zero-Trust Networking Who Dreamed of Fixing the Internet",
  "Liran Zvibel: The Architect Behind AI's Data Infrastructure Revolution",
  "Dave Rogenmoser, John Philip Morgan & Chris Hull: The Triumvirate Architects Behind Jasper AI's Ascent",
  "The Visionary Architects of AI Infrastructure: Lukas Biewald and Chris Van Pelt Transform Machine Learning Operations",
  "From Dreams to Digital: The Saidov Brothers and Beamery's Rise to Unicorn Status",
  "Ron Daniel: The Visionary Architect Behind Liquidity Group's AI Revolution",
  "Nicholas Harris: Engineering Light to Power the Future of AI",
  "Alex Bouaziz, Deel's Visionary CEO: Engineering the Global Workforce Revolution",
  "The Architects of Data Activation: Kashish Gupta and Tejas Manohar's Journey to Building Hightouch",
  "Mujeeb Ijaz of Our Next Energy: Visionary Leadership, Breakthroughs, and Impact",
  "Grant Demaree: Building OneBrief to Transform Military Decision-Making at the Speed of War",
  "Karandeep Anand: Architecting AI Entertainment's Next Chapter at Character.AI",
  "Iker Huerga: Pioneering the Future of AI-Enabled Drug Development",
  "Umesh Sachdev and Ravi Saraogi: Architecting Enterprise AI's Future",
  "Visionary Leaders in the Age of AI-Native Data Security: Yotam Segev and Tamar Bar-Ilan Transform Enterprise Data Protection",
  "Winston Weinberg: The Lawyer Who Built a $5 Billion AI Empire in Three Years",
  "Xu Li: The Visionary Leading SenseTime's AI Revolution Through Innovation and Resilience",
  "Sam Altman: Architecting the Future of AI Through Visionary Leadership",
  "Jack Hidary: Architecting the Quantum-AI Renaissance at SandboxAQ",
  "The Ocean of Intellect: Living in an Era of 1,000,000X (1Mx) Productivity, Now Onwards",
  "The Startup RenAIssance: How AI Transforms Global Entrepreneurship, Now Onwards!",
  "The AI Era: The Fastest Diffusion of a General Purpose Technology (GPT)",
  "The Autonomous Internet: When AI Agents Run Every Digital Touchpoint in Our Connected World",
  "The AI Agent Revolution: A Comprehensive Analysis of Global Workforce Transformation and Market Demand (2025-2045)",
  "The Architect of the Web's Future: Guillermo Rauch's Journey from Buenos Aires to Silicon Valley's Pinnacle",
  "Arthur Mensch: Architecting Europe's AI Renaissance Through Open Innovation",
  "The Mercor Triad: How Three 22-Year-Old Debate Champions Built the Fastest-Growing Company in History",
  "Yan Junjie: The AI Visionary Redefining China's Path to Artificial General Intelligence",
  "Daphne Koller: Pioneering the Future of AI-Driven Drug Discovery Through Insitro",
  "Hosam Arab: The Visionary Leading Tabby's Revolutionary Transformation of Middle East Finance",
  "Vishal Marria: The Architect of Decision Intelligence",
  "Pioneering the Future of AI-Driven Software Development: An In-Depth Assessment of Jason Warner and Eiso Kant's Revolutionary Journey at Poolside",
  "The Architect of Programmable IP: Seung Yoon Lee's Vision for Creator Rights in the AI Era",
  "The Virani Brothers: Architects of India's Snack Empire",
  "John Imah: The Visionary Architect Reshaping Fashion's AI Frontier",
  "Visionary Disruptors: The Triad Transforming India's Wealth Management Landscape",
  "The Visionary Duo Behind Writer: May Habib and Waseem AlShikh Transform Enterprise AI",
  "The Sakana AI Triumvirate: Pioneering Nature-Inspired AI in Japan",
  "Viswa Colluru: The Architect of Nature's Digital Renaissance",
  "Tuhin Srivastava: Building the Foundation of AI's Future",
  "Munjal Shah: The Visionary Architect of Healthcare AI Revolution",
  "David Luan: The Visionary Architect of Artificial General Intelligence",
  "Kevin Czinger: The Visionary Architect of Tomorrow's Manufacturing Revolution",
  "The Balaban Brothers: Twin Visionaries Powering the AI Revolution Through Lambda Labs",
  "The Fintech Architects: V.R. Govindarajan and Debasish Chakraborty Transform India's Financial Infrastructure Through Perfios",
  "The Visionary Architects: Ivan Zhao and Simon Last's Revolutionary Journey at Notion",
  "The Visionary Architect of Tomorrow: Bernt Børnich and the Humanoid Revolution at 1X Technologies",
  "Edwin Chen: The Quiet Genius Who Built AI's Most Essential Empire",
  "Jan Koum: The Privacy Pioneer Who Built WhatsApp Through Adversity",
  "The Modern Titans of Defense Tech: Palmer Luckey & Brian Schimpf Forge the Future of National Security",
  "Brett Adcock of Archer Aviation: Engineering Tomorrow's Sky Through Bold Vision and Strategic Leadership",
  "The Architect of Modern AI Networking: Jayashree Ullal's Transformational Leadership at Arista Networks",
  "Munir Machmud Ali: The Data Intelligence Visionary Reshaping Indonesia's Tech Landscape",
  "Jeffrey Cardenas: The Visionary Architect of Humanoid Robotics",
  "The Burrito Pioneer: How Bert Mueller Built India's Most Beloved Mexican Food Empire",
  "The Streaming Visionary: Anthony Wood's Journey from Dorm Room Dreams to Roku Empire",
  "The Kantara Visionary: Rishab Shetty's Revolutionary Journey Through the Lens of Entrepreneurial Excellence",
  "Brett Adcock: The Visionary Architect of AI's Physical Future",
  "Visionary Leadership in Humanoid Robotics: The Strategic Excellence of Peggy Johnson and Paras Velegapudi at Agility Robotics",
  "Victor Riparbelli: The Visionary Architect of AI-Powered Video Revolution",
  "The Visionaries of Wall Street Democracy: Vlad Tenev & Baiju Bhatt",
  "The Visionary Behind Spatial Intelligence: Fei-Fei Li's Revolutionary Journey with World Labs",
  "The Visionary Architects of AI's Future: Ramin Hasani and Mathias Lechner of Liquid AI",
  "Karol Hausman of Physical Intelligence: Charting the Future of Robotic Intelligence",
  "Tom Siebel: Vision Architect of Enterprise AI",
  "The Bezos Blueprint: A Visionary's Journey from Garage Startup to Global Empire",
  "The Architect of Apple: Steve Jobs' Struggle, Triumph, and the Path Forward",
  "The Visionary Duo: Kyle Vogt and Paril Jain's Revolutionary Robotics Journey",
  "The Skild Duo: How Deepak Pathak and Abhinav Gupta are Building the Future of Robotics Intelligence",
  "The Visionaries Behind Decagon: Jesse Zhang and Ashwin Sreenivas Redefining AI Customer Experience",
  "The Dynamic Duo Revolutionizing Drug Discovery: Chris Gibson and Dean Li's AI-Powered Vision at Recursion Pharmaceuticals",
  "The AI Native Visionaries: Arjun Prakash and Derek Ho's Revolutionary Journey with Distyl AI",
  "The Visionaries Behind the Light: David Lazovsky and Preet Virk's Revolutionary Journey with Celestial AI",
  "The Architect of AI Infrastructure: Rochan Sankar's Journey from Silicon Dreams to Nvidia's $900 Million Bet",
  "Celonis: The Process Intelligence Pioneer Transforming Enterprise Operations at Scale",
  "The Polymath Pioneers: How Daniel Nadler and Zachary Ziegler are Revolutionizing Medical Knowledge through AI",
  "The Saronic Quartet: Maritime Visionaries Redefining Naval Defense",
  "Jensen Huang: The Visionary Who Transformed Computing and Redefined Leadership",
  "The Visionary Behind the Wheel: Avneesh Agrawal and Netradyne's AI-Powered Revolution in Fleet Safety",
  "The Visionary Triad: How Jeremy Achin, Tom De Godoy, and Debanjan Saha are Democratizing AI Through DataRobot",
  "Eric Lefkofsky: The Serial Entrepreneur Revolutionizing Precision Medicine",
  "The Helsing Trinity: Architects of Europe's AI Defense Revolution",
  "The Visionary Duo Democratizing AI: Vipul Ved Prakash & Ce Zhang of Together AI",
  "The Venture Capital Titan: Sequoia Capital Through the Lens of Strategic Excellence",
  "The Voice Visionaries: Mati Staniszewski and Piotr Dąbkowski Revolutionizing AI Audio",
  "The Pioneering Leaders Revolutionizing Mineral Exploration: Kurt House, Josh Goldman, and Mfikeyi Makayi of KoBold Metals",
  "The Visionary Trio Behind Runway AI: Revolutionizing Creative Technology Through Generative Intelligence",
  "Kareem Amin & Varun Anand: The Visionary Duo Revolutionizing Go-to-Market with Clay AI",
  "Matt Zeiler: The Visionary Behind Clarifai's AI Revolution",
  "The Visionary Duo: Varun Mohan and Douglas Chen's Journey to AI Coding Supremacy",
  "Vision, Ingenuity, and Industry: The Simon Kalouche & Nimble Story",
  "The Trinity of Innovation: Mustafa Suleyman, Karén Simonyan, and Reid Hoffman's Journey Through AI's Next Frontier",
  "The Evolution of Industry: From Steam Power to Quantum Intelligence",
  "When Tier-1 VC Validation Becomes Ecosystem Fuel",
  "Scott Wu: The Mathematical Prodigy Revolutionizing AI Software Engineering",
  "The VideoVerse Visionaries: Transforming AI-Powered Video Technology",
  "Mira Murati and Thinking Machines Lab: Pioneering Human-Centric Frontier AI",
  "The Moonshot Visionary: Yang Zhilin - Pioneering China's AI Renaissance",
  "Dr. Shiv Rao: The Cardiologist-CEO Transforming Healthcare with AI",
  "The Moveworks Quartet: How 4 Visionaries Built a $2.85 Billion AI Empire",
  "The Glean Quartet: Visionary Leadership Transforming Enterprise AI",
  "The Visionary Quartet Behind Cursor AI",
  "From Mathematics to Market Mastery: The Fractal Analytics Trinity",
  "The Grammarly Triumvirate: How Three Ukrainian Visionaries Built a $13 Billion AI Empire",
  "Tim Schumacher: The Domain Visionary Who Became Europe's Climate Tech Champion",
  "The Automation Architects: How Daniel Dines, Marius Tîrcă & Rahul Sood Built UiPath's $36 Billion Empire",
  "The Meteoric Rise of Michael Intrator: From Wall Street Trader to AI Empire Builder",
  "The Visionary Behind the $100+ Billion Data Revolution",
  "The Amodei Siblings: Transforming AI Through Constitutional Innovation",
  "The Visionary Who Democratized Design: Melanie Perkins' Extraordinary Journey",
  "Liang Wenfeng: The Maverick Who Disrupted AI with DeepSeek",
  "Ilya Sutskever: The Neural Network Visionary Who Architected the AI Revolution",
  "Zhang Yiming and Liang Rubo: The ByteDance Revolution",
  "Suzanne Gildert: Pioneer of Conscious AI Revolution",
  "Aravind Srinivas: From IIT Chennai to the Forefront of AI Search Revolution",
  "AI Unicorns & Soonicorns: The $1.1 Trillion AI Revolution Reshaping Global Business",
  "Demis Hassabis: From Chess Prodigy to Nobel Laureate",
  "Alexandr Wang: From Math Prodigy to Meta's AI Visionary",
  "Nikita Bier: The Master of Viral App Creation and the Future of Growth",
  "The Intelligence Convergence: When Every Human Becomes a Superpower",
  "The Innovation Spawning",
  "The Great Acceleration",
  "Gaming Riddle: Unleashing India's Cognitive Economy?",
  "The Great AI Paradox: When Innovation Meets the Reality of Implementation",
  "The Great AI Reckoning: When Innovation Meets Reality in the Age of AI",
  "The Velocity Revolution: How AI is Reshaping Global Competition",
  "The Productive Man-Years Revolution: How AI is Redefining History's Greatest Demographic Shift",
  "The Strategic Awakening: Legacy Giants Face the Agentic AI Revolution",
  "The Great Leveling: How Agentic AI Is Rewriting the Rules of Digital Dominance",
  "The Opportunity Revolution: The Greatest Democratization of Wealth Creation",
  "The Intelligence Convergence: How 2025 Became the Year Everything Changed",
  "The RenAIssance Revolution: How Organic AI, Quantum Computing & Nuclear Breakthroughs are Orchestrating Renaissance",
  "The RenAIssance: How AI Is Orchestrating Humanity's Greatest Innovation, Renaissance",
  "Catalyzing the Hyper-Unicorn Era: How AI-First Ecosystems Are Turning Founders into Global Game-Changers",
  "The AI Era: Humanity's Multiverse Bang",
  "Breaking the Intelligence Singularity: From Steve Jobs' Leadership Paradox to Consciousness-Enabled AI Systems - Part 2",
  "Breaking the Intelligence Singularity: From Steve Jobs' Leadership Paradox to Consciousness-Enabled AI Systems - Part 1"
];

function categorizeArticle(title: string): string {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('ai') || titleLower.includes('artificial') || titleLower.includes('machine learning') || 
      titleLower.includes('neural') || titleLower.includes('deep learning') || titleLower.includes('llm') ||
      titleLower.includes('gpt') || titleLower.includes('agi') || titleLower.includes('quantum') ||
      titleLower.includes('intelligence')) {
    return 'AI';
  }
  
  if (titleLower.includes('ceo') || titleLower.includes('founder') || titleLower.includes('visionary') ||
      titleLower.includes('architect') || titleLower.includes('leadership') || titleLower.includes('leader') ||
      titleLower.includes('pioneer') || titleLower.includes('duo') || titleLower.includes('trio') ||
      titleLower.includes('quartet') || titleLower.includes('triad')) {
    return 'Leadership';
  }
  
  if (titleLower.includes('cloud') || titleLower.includes('tech') || titleLower.includes('software') ||
      titleLower.includes('nvidia') || titleLower.includes('meta') || titleLower.includes('google') ||
      titleLower.includes('microsoft') || titleLower.includes('amazon') || titleLower.includes('aws') ||
      titleLower.includes('infrastructure') || titleLower.includes('computing')) {
    return 'Technology';
  }
  
  return 'Business Strategy';
}

function generateExcerpt(title: string): string {
  const excerpts: Record<string, string> = {
    'AI': 'Exploring the cutting edge of artificial intelligence and its transformative impact on industries worldwide.',
    'Technology': 'Deep dive into the technology innovations shaping the future of digital infrastructure and computing.',
    'Leadership': 'Insights into the visionary leaders driving innovation and building tomorrow\'s most valuable companies.',
    'Business Strategy': 'Strategic analysis of market dynamics, business models, and the path to building unicorn companies.'
  };
  
  const category = categorizeArticle(title);
  return excerpts[category] || excerpts['Business Strategy'];
}

function getPublishedDate(index: number): Date {
  const now = new Date();
  const hoursAgo = index < 5 ? index * 6 : 
                   index < 20 ? (index - 5) * 12 + 30 :
                   index < 50 ? (index - 20) * 24 + 200 :
                   index < 100 ? (index - 50) * 24 + 920 :
                   (index - 100) * 12 + 2120;
  
  return new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
}

function getImageExtension(index: number): string {
  const pngIndices = [2, 4, 5, 7, 8, 9, 11, 13, 15, 17, 22, 23, 28, 30, 41, 49, 56, 57, 58, 59, 61, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 182, 183, 184, 185, 186, 187, 188, 190, 192, 193, 194, 195, 196, 197, 199, 200, 201, 202, 203, 204, 208, 210, 214, 219, 223];
  return pngIndices.includes(index) ? 'png' : 'jpeg';
}

function getLinkedInUrl(title: string): string {
  return articleUrlMap[title] || defaultLinkedInUrl;
}

export async function seedBlogArticles(forceReset = false) {
  console.log("Checking blog articles...");
  
  try {
    const existingCount = await db.execute(sql`SELECT COUNT(*) as count FROM blog_articles`);
    const count = Number(existingCount.rows[0]?.count || 0);
    
    if (count > 0 && !forceReset) {
      console.log(`Blog already has ${count} articles, skipping seed`);
      return;
    }
    
    if (forceReset) {
      await db.execute(sql`DELETE FROM blog_articles`);
      console.log("Cleared existing articles");
    }
    
    console.log("Seeding blog articles...");
    
    const articlesToInsert = allArticles.map((title, index) => {
      const category = categorizeArticle(title);
      const imageNum = index + 1;
      const ext = getImageExtension(index);
      return {
        title,
        excerpt: generateExcerpt(title),
        content: `Full article content for: ${title}`,
        category,
        author: "Girish Hukkeri",
        imageUrl: `/article-images/image${imageNum}.${ext}`,
        linkedinUrl: getLinkedInUrl(title),
        isFeatured: index === 0,
        publishedDate: getPublishedDate(index),
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });
    
    for (const article of articlesToInsert) {
      await db.insert(blogArticles).values(article);
    }
    
    console.log(`Successfully seeded ${articlesToInsert.length} blog articles`);
    
  } catch (error) {
    console.error("Error seeding blog articles:", error);
    throw error;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedBlogArticles()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
