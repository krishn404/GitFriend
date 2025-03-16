"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Copy, Search } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Emoji {
  emoji: string
  code: string
  description: string
  category: string
}

// Extended categories to include People and Nature from the markdown files
const CATEGORIES = [
  "all", 
  "added", 
  "fixed", 
  "improved", 
  "removed", 
  "security", 
  "config", 
  "docs", 
  "ui", 
  "other",
  "people",
  "nature",
  "objects",
  "places",
  "symbols"
]

// Emoji data based on GitHub supported emojis, now including all emojis from the markdown files
const EMOJIS: Emoji[] = [
  // Added
  { emoji: "✨", code: ":sparkles:", description: "Introduce new features", category: "added" },
  { emoji: "🎉", code: ":tada:", description: "Begin a project", category: "added" },
  { emoji: "✅", code: ":white_check_mark:", description: "Add tests", category: "added" },
  { emoji: "🔊", code: ":loud_sound:", description: "Add logs", category: "added" },
  { emoji: "➕", code: ":heavy_plus_sign:", description: "Add dependencies", category: "added" },
  { emoji: "🔌", code: ":electric_plug:", description: "Add plugin", category: "added" },
  { emoji: "🚀", code: ":rocket:", description: "Deploy stuff", category: "added" },
  { emoji: "🆕", code: ":new:", description: "Add something new", category: "added" },
  { emoji: "👷", code: ":construction_worker:", description: "Add CI build system", category: "added" },

  // Fixed
  { emoji: "🐛", code: ":bug:", description: "Fix a bug", category: "fixed" },
  { emoji: "🚑", code: ":ambulance:", description: "Critical hotfix", category: "fixed" },
  { emoji: "🔒", code: ":lock:", description: "Fix security issues", category: "fixed" },
  { emoji: "🩹", code: ":adhesive_bandage:", description: "Simple fix for a non-critical issue", category: "fixed" },
  { emoji: "💥", code: ":boom:", description: "Fix crash", category: "fixed" },
  { emoji: "🧪", code: ":test_tube:", description: "Fix failing tests", category: "fixed" },
  { emoji: "🔨", code: ":hammer:", description: "Fix build", category: "fixed" },
  { emoji: "🚨", code: ":rotating_light:", description: "Fix compiler/linter warnings", category: "fixed" },

  // Improved
  { emoji: "♻️", code: ":recycle:", description: "Refactor code", category: "improved" },
  { emoji: "⚡️", code: ":zap:", description: "Improve performance", category: "improved" },
  { emoji: "🚸", code: ":children_crossing:", description: "Improve user experience", category: "improved" },
  { emoji: "💄", code: ":lipstick:", description: "Update UI and style files", category: "improved" },
  { emoji: "🎨", code: ":art:", description: "Improve structure/format of the code", category: "improved" },
  { emoji: "⬆️", code: ":arrow_up:", description: "Upgrade dependencies", category: "improved" },
  { emoji: "⬇️", code: ":arrow_down:", description: "Downgrade dependencies", category: "improved" },
  { emoji: "🔧", code: ":wrench:", description: "Add or update configuration files", category: "improved" },
  { emoji: "🔖", code: ":bookmark:", description: "Release / Version tags", category: "improved" },

  // Removed
  { emoji: "🔥", code: ":fire:", description: "Remove code or files", category: "removed" },
  { emoji: "➖", code: ":heavy_minus_sign:", description: "Remove dependencies", category: "removed" },
  { emoji: "🗑️", code: ":wastebasket:", description: "Deprecate code", category: "removed" },

  // Security
  { emoji: "🔒", code: ":lock:", description: "Fix security issues", category: "security" },
  { emoji: "🔐", code: ":closed_lock_with_key:", description: "Add or update secrets", category: "security" },
  {
    emoji: "🛂",
    code: ":passport_control:",
    description: "Work on code related to authorization",
    category: "security",
  },

  // Config
  { emoji: "🔧", code: ":wrench:", description: "Add or update configuration files", category: "config" },
  { emoji: "🔨", code: ":hammer:", description: "Add or update development scripts", category: "config" },
  { emoji: "📦", code: ":package:", description: "Add or update compiled files or packages", category: "config" },
  { emoji: "👷", code: ":construction_worker:", description: "Add or update CI build system", category: "config" },
  { emoji: "📝", code: ":memo:", description: "Add or update configuration files", category: "config" },

  // Docs
  { emoji: "📝", code: ":memo:", description: "Add or update documentation", category: "docs" },
  { emoji: "📚", code: ":books:", description: "Add or update documentation", category: "docs" },
  { emoji: "💡", code: ":bulb:", description: "Add or update comments in source code", category: "docs" },
  { emoji: "📄", code: ":page_facing_up:", description: "Add or update license", category: "docs" },

  // UI
  { emoji: "💄", code: ":lipstick:", description: "Add or update the UI and style files", category: "ui" },
  { emoji: "🎨", code: ":art:", description: "Improve structure/format of the code", category: "ui" },
  { emoji: "🚸", code: ":children_crossing:", description: "Improve user experience / usability", category: "ui" },
  { emoji: "♿️", code: ":wheelchair:", description: "Improve accessibility", category: "ui" },
  { emoji: "💫", code: ":dizzy:", description: "Add or update animations and transitions", category: "ui" },

  // Other
  { emoji: "🚧", code: ":construction:", description: "Work in progress", category: "other" },
  { emoji: "💩", code: ":poop:", description: "Write bad code that needs to be improved", category: "other" },
  { emoji: "🍻", code: ":beers:", description: "Write code drunkenly", category: "other" },
  { emoji: "🔍", code: ":mag:", description: "Improve SEO", category: "other" },
  { emoji: "💬", code: ":speech_balloon:", description: "Add or update text and literals", category: "other" },
  { emoji: "🥚", code: ":egg:", description: "Add or update an easter egg", category: "other" },
  { emoji: "🌱", code: ":seedling:", description: "Add or update seed files", category: "other" },
  { emoji: "🏷️", code: ":label:", description: "Add or update types", category: "other" },
  { emoji: "🏗️", code: ":building_construction:", description: "Make architectural changes", category: "other" },
  { emoji: "📱", code: ":iphone:", description: "Work on responsive design", category: "other" },
  { emoji: "🤡", code: ":clown_face:", description: "Mock things", category: "other" },
  { emoji: "🥅", code: ":goal_net:", description: "Catch errors", category: "other" },
  { emoji: "📸", code: ":camera_flash:", description: "Add or update snapshots", category: "other" },
  { emoji: "⚗️", code: ":alembic:", description: "Perform experiments", category: "other" },
  { emoji: "🔍", code: ":mag:", description: "Improve SEO", category: "other" },
  { emoji: "🏁", code: ":checkered_flag:", description: "Fix something on Windows", category: "other" },
  { emoji: "🍎", code: ":apple:", description: "Fix something on macOS", category: "other" },
  { emoji: "🐧", code: ":penguin:", description: "Fix something on Linux", category: "other" },
  { emoji: "🤖", code: ":robot:", description: "Fix something on Android", category: "other" },
  { emoji: "🍏", code: ":green_apple:", description: "Fix something on iOS", category: "other" },
  
  // People Emojis (from 01. Emojis - People.md)
  { emoji: "😊", code: ":smile:", description: "Smile face", category: "people" },
  { emoji: "😄", code: ":laughing:", description: "Laughing face", category: "people" },
  { emoji: "😊", code: ":blush:", description: "Blush face", category: "people" },
  { emoji: "😃", code: ":smiley:", description: "Smiley face", category: "people" },
  { emoji: "☺️", code: ":relaxed:", description: "Relaxed face", category: "people" },
  { emoji: "😏", code: ":smirk:", description: "Smirk face", category: "people" },
  { emoji: "😍", code: ":heart_eyes:", description: "Heart eyes", category: "people" },
  { emoji: "😘", code: ":kissing_heart:", description: "Kissing heart", category: "people" },
  { emoji: "😚", code: ":kissing_closed_eyes:", description: "Kissing with closed eyes", category: "people" },
  { emoji: "😳", code: ":flushed:", description: "Flushed face", category: "people" },
  { emoji: "😌", code: ":relieved:", description: "Relieved face", category: "people" },
  { emoji: "😁", code: ":grin:", description: "Grinning face", category: "people" },
  { emoji: "😉", code: ":wink:", description: "Winking face", category: "people" },
  { emoji: "😜", code: ":stuck_out_tongue_winking_eye:", description: "Face with stuck-out tongue and winking eye", category: "people" },
  { emoji: "😝", code: ":stuck_out_tongue_closed_eyes:", description: "Face with stuck-out tongue and closed eyes", category: "people" },
  { emoji: "😀", code: ":grinning:", description: "Grinning face", category: "people" },
  { emoji: "💋", code: ":kiss:", description: "Kiss mark", category: "people" },
  { emoji: "👋", code: ":wave:", description: "Waving hand", category: "people" },
  { emoji: "👍", code: ":+1:", description: "Thumbs up", category: "people" },
  { emoji: "👎", code: ":-1:", description: "Thumbs down", category: "people" },
  { emoji: "👌", code: ":ok_hand:", description: "OK hand", category: "people" },
  { emoji: "👊", code: ":punch:", description: "Oncoming fist", category: "people" },
  { emoji: "✊", code: ":fist:", description: "Raised fist", category: "people" },
  { emoji: "✌️", code: ":v:", description: "Victory hand", category: "people" },
  { emoji: "👏", code: ":clap:", description: "Clapping hands", category: "people" },
  { emoji: "💪", code: ":muscle:", description: "Flexed biceps", category: "people" },
  { emoji: "🙏", code: ":pray:", description: "Folded hands", category: "people" },
  { emoji: "☝️", code: ":point_up:", description: "Index pointing up", category: "people" },
  { emoji: "👆", code: ":point_up_2:", description: "Backhand index pointing up", category: "people" },
  { emoji: "👇", code: ":point_down:", description: "Backhand index pointing down", category: "people" },
  { emoji: "👈", code: ":point_left:", description: "Backhand index pointing left", category: "people" },
  { emoji: "👉", code: ":point_right:", description: "Backhand index pointing right", category: "people" },
  { emoji: "🖖", code: ":vulcan_salute:", description: "Vulcan salute", category: "people" },
  { emoji: "🤘", code: ":metal:", description: "Sign of the horns", category: "people" },
  { emoji: "🖕", code: ":fu:", description: "Middle finger", category: "people" },
  { emoji: "💁", code: ":information_desk_person:", description: "Person tipping hand", category: "people" },
  { emoji: "🙋", code: ":raising_hand:", description: "Person raising hand", category: "people" },
  { emoji: "💇", code: ":haircut:", description: "Person getting haircut", category: "people" },
  { emoji: "💆", code: ":massage:", description: "Person getting massage", category: "people" },
  { emoji: "💑", code: ":couple_with_heart:", description: "Couple with heart", category: "people" },
  { emoji: "👨", code: ":man:", description: "Man", category: "people" },
  { emoji: "👩", code: ":woman:", description: "Woman", category: "people" },
  { emoji: "👦", code: ":boy:", description: "Boy", category: "people" },
  { emoji: "👧", code: ":girl:", description: "Girl", category: "people" },
  { emoji: "👶", code: ":baby:", description: "Baby", category: "people" },
  { emoji: "👴", code: ":older_man:", description: "Old man", category: "people" },
  { emoji: "👵", code: ":older_woman:", description: "Old woman", category: "people" },
  { emoji: "💏", code: ":couplekiss_man_woman:", description: "Kiss", category: "people" },
  { emoji: "👮", code: ":cop:", description: "Police officer", category: "people" },
  { emoji: "👷", code: ":construction_worker:", description: "Construction worker", category: "people" },
  { emoji: "👸", code: ":princess:", description: "Princess", category: "people" },
  { emoji: "👼", code: ":angel:", description: "Baby angel", category: "people" },
  { emoji: "💀", code: ":skull:", description: "Skull", category: "people" },
  { emoji: "👻", code: ":ghost:", description: "Ghost", category: "people" },
  
  // Nature Emojis (from 02. Emojis - Nature.md)
  { emoji: "☀️", code: ":sunny:", description: "Sun", category: "nature" },
  { emoji: "☔", code: ":umbrella:", description: "Umbrella with rain drops", category: "nature" },
  { emoji: "☁️", code: ":cloud:", description: "Cloud", category: "nature" },
  { emoji: "❄️", code: ":snowflake:", description: "Snowflake", category: "nature" },
  { emoji: "⛄", code: ":snowman:", description: "Snowman without snow", category: "nature" },
  { emoji: "⚡", code: ":zap:", description: "High voltage", category: "nature" },
  { emoji: "🌀", code: ":cyclone:", description: "Cyclone", category: "nature" },
  { emoji: "🌁", code: ":foggy:", description: "Foggy", category: "nature" },
  { emoji: "🌊", code: ":ocean:", description: "Water wave", category: "nature" },
  { emoji: "🐱", code: ":cat:", description: "Cat face", category: "nature" },
  { emoji: "🐶", code: ":dog:", description: "Dog face", category: "nature" },
  { emoji: "🐭", code: ":mouse:", description: "Mouse face", category: "nature" },
  { emoji: "🐹", code: ":hamster:", description: "Hamster", category: "nature" },
  { emoji: "🐰", code: ":rabbit:", description: "Rabbit face", category: "nature" },
  { emoji: "🐺", code: ":wolf:", description: "Wolf", category: "nature" },
  { emoji: "🐸", code: ":frog:", description: "Frog", category: "nature" },
  { emoji: "🐯", code: ":tiger:", description: "Tiger face", category: "nature" },
  { emoji: "🐨", code: ":koala:", description: "Koala", category: "nature" },
  { emoji: "🐻", code: ":bear:", description: "Bear", category: "nature" },
  { emoji: "🐷", code: ":pig:", description: "Pig face", category: "nature" },
  { emoji: "🐽", code: ":pig_nose:", description: "Pig nose", category: "nature" },
  { emoji: "🐮", code: ":cow:", description: "Cow face", category: "nature" },
  { emoji: "🐗", code: ":boar:", description: "Boar", category: "nature" },
  { emoji: "🐵", code: ":monkey_face:", description: "Monkey face", category: "nature" },
  { emoji: "🐒", code: ":monkey:", description: "Monkey", category: "nature" },
  { emoji: "🐴", code: ":horse:", description: "Horse face", category: "nature" },
  { emoji: "🐎", code: ":racehorse:", description: "Horse", category: "nature" },
  { emoji: "🐫", code: ":camel:", description: "Bactrian camel", category: "nature" },
  { emoji: "🐑", code: ":sheep:", description: "Ewe", category: "nature" },
  { emoji: "🐘", code: ":elephant:", description: "Elephant", category: "nature" },
  { emoji: "🐼", code: ":panda_face:", description: "Panda", category: "nature" },
  { emoji: "🐍", code: ":snake:", description: "Snake", category: "nature" },
  { emoji: "🐦", code: ":bird:", description: "Bird", category: "nature" },
  { emoji: "🐤", code: ":baby_chick:", description: "Baby chick", category: "nature" },
  { emoji: "🐧", code: ":penguin:", description: "Penguin", category: "nature" },
  { emoji: "🐢", code: ":turtle:", description: "Turtle", category: "nature" },
  { emoji: "🐠", code: ":tropical_fish:", description: "Tropical fish", category: "nature" },
  { emoji: "🐟", code: ":fish:", description: "Fish", category: "nature" },
  { emoji: "🐬", code: ":dolphin:", description: "Dolphin", category: "nature" },
  { emoji: "🌸", code: ":cherry_blossom:", description: "Cherry blossom", category: "nature" },
  { emoji: "🌷", code: ":tulip:", description: "Tulip", category: "nature" },
  { emoji: "🍀", code: ":four_leaf_clover:", description: "Four leaf clover", category: "nature" },
  { emoji: "🌹", code: ":rose:", description: "Rose", category: "nature" },
  { emoji: "🌻", code: ":sunflower:", description: "Sunflower", category: "nature" },
  { emoji: "🌺", code: ":hibiscus:", description: "Hibiscus", category: "nature" },
  { emoji: "🍁", code: ":maple_leaf:", description: "Maple leaf", category: "nature" },
  { emoji: "🍃", code: ":leaves:", description: "Leaf fluttering in wind", category: "nature" },
  { emoji: "🍂", code: ":fallen_leaf:", description: "Fallen leaf", category: "nature" },
  { emoji: "🌿", code: ":herb:", description: "Herb", category: "nature" },
  { emoji: "🍄", code: ":mushroom:", description: "Mushroom", category: "nature" },
  { emoji: "🌵", code: ":cactus:", description: "Cactus", category: "nature" },
  { emoji: "🌴", code: ":palm_tree:", description: "Palm tree", category: "nature" },
  { emoji: "🌲", code: ":evergreen_tree:", description: "Evergreen tree", category: "nature" },
  { emoji: "🌳", code: ":deciduous_tree:", description: "Deciduous tree", category: "nature" },
  { emoji: "🌰", code: ":chestnut:", description: "Chestnut", category: "nature" },
  { emoji: "🌱", code: ":seedling:", description: "Seedling", category: "nature" },
  { emoji: "🌼", code: ":blossom:", description: "Blossom", category: "nature" },
  { emoji: "🌞", code: ":sun_with_face:", description: "Sun with face", category: "nature" },
  { emoji: "🌝", code: ":full_moon_with_face:", description: "Full moon with face", category: "nature" },
  { emoji: "🌚", code: ":new_moon_with_face:", description: "New moon with face", category: "nature" },
  { emoji: "🌕", code: ":full_moon:", description: "Full moon", category: "nature" },
  { emoji: "🌖", code: ":waning_gibbous_moon:", description: "Waning gibbous moon", category: "nature" },
  { emoji: "🌗", code: ":last_quarter_moon:", description: "Last quarter moon", category: "nature" },
  { emoji: "🌘", code: ":waning_crescent_moon:", description: "Waning crescent moon", category: "nature" },
  { emoji: "🌑", code: ":new_moon:", description: "New moon", category: "nature" },
  { emoji: "🌒", code: ":waxing_crescent_moon:", description: "Waxing crescent moon", category: "nature" },
  { emoji: "🌓", code: ":first_quarter_moon:", description: "First quarter moon", category: "nature" },

  // Objects
  { emoji: "📱", code: ":iphone:", description: "Mobile phone", category: "objects" },
  { emoji: "💻", code: ":computer:", description: "Computer", category: "objects" },
  { emoji: "🖥️", code: ":desktop:", description: "Desktop computer", category: "objects" },
  { emoji: "📷", code: ":camera:", description: "Camera", category: "objects" },
  { emoji: "📚", code: ":books:", description: "Books", category: "objects" },
  { emoji: "📝", code: ":memo:", description: "Memo", category: "objects" },
  { emoji: "🔧", code: ":wrench:", description: "Wrench", category: "objects" },
  { emoji: "🔨", code: ":hammer:", description: "Hammer", category: "objects" },
  { emoji: "💡", code: ":bulb:", description: "Light bulb", category: "objects" },
  { emoji: "🔑", code: ":key:", description: "Key", category: "objects" },
  { emoji: "🎮", code: ":video_game:", description: "Video game", category: "objects" },
  { emoji: "🎨", code: ":art:", description: "Artist palette", category: "objects" },

  // Places
  { emoji: "🏠", code: ":house:", description: "House", category: "places" },
  { emoji: "🏢", code: ":office:", description: "Office building", category: "places" },
  { emoji: "🏭", code: ":factory:", description: "Factory", category: "places" },
  { emoji: "🏫", code: ":school:", description: "School", category: "places" },
  { emoji: "🏥", code: ":hospital:", description: "Hospital", category: "places" },
  { emoji: "🌆", code: ":city_sunset:", description: "Cityscape at dusk", category: "places" },
  { emoji: "🌇", code: ":city_sunrise:", description: "Sunrise over mountains", category: "places" },
  { emoji: "✈️", code: ":airplane:", description: "Airplane", category: "places" },
  { emoji: "🚀", code: ":rocket:", description: "Rocket", category: "places" },
  { emoji: "🚗", code: ":car:", description: "Automobile", category: "places" },
  { emoji: "🚂", code: ":steam_locomotive:", description: "Steam locomotive", category: "places" },
  { emoji: "🏁", code: ":checkered_flag:", description: "Checkered flag", category: "places" },

  // Symbols
  { emoji: "✅", code: ":white_check_mark:", description: "White check mark", category: "symbols" },
  { emoji: "❌", code: ":x:", description: "Cross mark", category: "symbols" },
  { emoji: "⭕", code: ":o:", description: "Heavy large circle", category: "symbols" },
  { emoji: "❗", code: ":exclamation:", description: "Exclamation mark", category: "symbols" },
  { emoji: "❓", code: ":question:", description: "Question mark", category: "symbols" },
  { emoji: "⚠️", code: ":warning:", description: "Warning sign", category: "symbols" },
  { emoji: "🔔", code: ":bell:", description: "Bell", category: "symbols" },
  { emoji: "🔒", code: ":lock:", description: "Lock", category: "symbols" },
  { emoji: "🔓", code: ":unlock:", description: "Unlock", category: "symbols" },
  { emoji: "💲", code: ":heavy_dollar_sign:", description: "Heavy dollar sign", category: "symbols" },
  { emoji: "✨", code: ":sparkles:", description: "Sparkles", category: "symbols" },
  { emoji: "💯", code: ":100:", description: "Hundred points", category: "symbols" }
]

export function CommitEmojis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)

  const filteredEmojis = EMOJIS.filter((emoji) => {
    const matchesSearch =
      emoji.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.code.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "all" || emoji.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (text: string, emojiCode: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEmoji(emojiCode)
    setTimeout(() => setCopiedEmoji(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-4 sm:p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-foreground">Emoji Selector</h3>
          <p className="text-sm text-muted-foreground">Click emoji to copy emoji, click code to copy code</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Input
            placeholder="Search emojis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-background border-input"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>

        {/* Category Tabs */}
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
          <TabsList className="w-full flex flex-wrap h-auto bg-muted/50 p-1 rounded-lg">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="flex-1 min-w-[80px] capitalize py-1.5 data-[state=active]:bg-background rounded-md transition-all text-xs sm:text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Updated Emoji Grid */}
        {filteredEmojis.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredEmojis.map((emoji) => (
              <Card
                key={emoji.code}
                className="bg-muted/30 border-border/50 hover:bg-muted/50 transition-colors group overflow-hidden"
              >
                <div className="p-3 flex flex-col items-center text-center relative">
                  <div 
                    className="text-2xl mb-2 cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
                    onClick={() => copyToClipboard(emoji.emoji, `${emoji.code}-emoji`)}
                  >
                    {emoji.emoji}
                  </div>
                  <div 
                    className="text-xs font-mono text-primary mb-1 cursor-pointer group/code relative"
                    onClick={() => copyToClipboard(emoji.code, `${emoji.code}-code`)}
                  >
                    <span className="relative z-10 hover:text-white transition-colors duration-200">
                      {emoji.code}
                    </span>
                    <span className="absolute inset-0 bg-primary scale-x-0 group-hover/code:scale-x-100 transition-transform duration-200 origin-left rounded-sm -z-0" />
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{emoji.description}</div>
                  {copiedEmoji === `${emoji.code}-emoji` && (
                    <div className="absolute top-0 inset-x-0 bg-green-500/10 text-green-500 text-xs py-1 animate-in fade-in slide-in-from-top duration-300">
                      Copied emoji!
                    </div>
                  )}
                  {copiedEmoji === `${emoji.code}-code` && (
                    <div className="absolute top-0 inset-x-0 bg-green-500/10 text-green-500 text-xs py-1 animate-in fade-in slide-in-from-top duration-300">
                      Copied code!
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">No emojis found matching your search</div>
        )}
      </div>
    </div>
  )
}