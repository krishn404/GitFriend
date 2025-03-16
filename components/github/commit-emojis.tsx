"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Check, Search, X, Code } from "lucide-react"
import { motion } from "framer-motion"
import toast, { Toaster } from "react-hot-toast"

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
  "symbols",
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
  {
    emoji: "😜",
    code: ":stuck_out_tongue_winking_eye:",
    description: "Face with stuck-out tongue and winking eye",
    category: "people",
  },
  {
    emoji: "😝",
    code: ":stuck_out_tongue_closed_eyes:",
    description: "Face with stuck-out tongue and closed eyes",
    category: "people",
  },
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
  { emoji: "💯", code: ":100:", description: "Hundred points", category: "symbols" },
]

// Replace the entire CommitEmojis component with this enhanced version
export function CommitEmojis() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)

  const filteredEmojis = EMOJIS.filter((emoji) => {
    const matchesSearch =
      emoji.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emoji.emoji.includes(searchTerm.toLowerCase())

    const matchesCategory = activeCategory === "all" || emoji.category === activeCategory

    return matchesSearch && matchesCategory
  })

  const copyToClipboard = (text: string, type: "emoji" | "code") => {
    navigator.clipboard.writeText(text)

    // Show toast notification with react-hot-toast
    if (type === "emoji") {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">{text}</div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-foreground">Emoji copied!</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text} has been copied to your clipboard</p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-border">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 2000 },
      )
    } else {
      toast.custom(
        (t) => (
          <div
            className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-background shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Code className="h-5 w-5" />
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-foreground">Code copied!</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    <code className="bg-muted px-1 py-0.5 rounded">{text}</code> has been copied to your clipboard
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-border">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary hover:text-primary/80 focus:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        ),
        { duration: 2000 },
      )
    }

    // Also set the copied state for visual feedback in the UI
    setCopiedEmoji(`${text}-${type}`)
    setTimeout(() => setCopiedEmoji(null), 1000)
  }

  // Group categories for better organization
  const categoryGroups = {
    main: ["all", "added", "fixed", "improved", "removed"],
    secondary: ["security", "config", "docs", "ui", "other"],
    emoji: ["people", "nature", "objects", "places", "symbols"],
  }

  // Get popular emojis for quick access
  const popularEmojis = [
    EMOJIS.find((e) => e.code === ":sparkles:"),
    EMOJIS.find((e) => e.code === ":bug:"),
    EMOJIS.find((e) => e.code === ":rocket:"),
    EMOJIS.find((e) => e.code === ":fire:"),
    EMOJIS.find((e) => e.code === ":memo:"),
    EMOJIS.find((e) => e.code === ":art:"),
  ].filter(Boolean) as Emoji[]

  return (
    <div className="space-y-6">
      {/* Toast container for react-hot-toast */}
      <Toaster position="top-right" />

      {/* Header Card */}
      <div className="bg-gradient-to-br from-primary/5 via-card to-secondary/5 border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
                  <span className="text-3xl">✨</span>
                  <span>Git Commit Emojis</span>
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl">
                  Enhance your commit messages with expressive emojis. Click on any emoji to copy it to your clipboard.
                </p>
              </div>
            </div>

            {/* Quick Access */}
            <div className="flex flex-wrap gap-2">
              {popularEmojis.map((emoji) => (
                <motion.button
                  key={emoji.code}
                  className="flex items-center gap-2 px-3 py-1.5 bg-background/80 backdrop-blur-sm hover:bg-background border border-border/50 rounded-full text-sm transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyToClipboard(emoji.emoji, "emoji")}
                >
                  <span className="text-lg">{emoji.emoji}</span>
                  <span className="font-medium">{emoji.description}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="border-b border-border bg-muted/30 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-medium text-foreground">Browse Emojis</h3>

            {/* Search */}
            <div className="relative w-full sm:w-64 md:w-80">
              <Input
                placeholder="Search emojis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-background/80 backdrop-blur-sm border-input focus-visible:ring-primary/20"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {/* Category Tabs */}
          <div className="mb-6">
            <div className="text-xs font-medium text-muted-foreground mb-2">Categories</div>
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {categoryGroups.main.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`h-8 rounded-full text-xs capitalize ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80 text-foreground"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category === "all" ? "All Emojis" : category}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categoryGroups.secondary.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`h-8 rounded-full text-xs capitalize ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80 text-foreground"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {categoryGroups.emoji.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    className={`h-8 rounded-full text-xs capitalize ${
                      activeCategory === category
                        ? "bg-primary text-primary-foreground"
                        : "bg-background hover:bg-background/80 text-foreground"
                    }`}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">
              {filteredEmojis.length} {filteredEmojis.length === 1 ? "emoji" : "emojis"} found
              {activeCategory !== "all" && ` in "${activeCategory}"`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>

            {(activeCategory !== "all" || searchTerm) && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setSearchTerm("")
                  setActiveCategory("all")
                }}
              >
                <X className="h-3 w-3 mr-1" />
                Clear filters
              </Button>
            )}
          </div>

          {/* Emoji Grid */}
          {filteredEmojis.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {filteredEmojis.map((emoji) => (
                <motion.div
                  key={emoji.code}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.03, y: -2 }}
                  onMouseEnter={() => setHoveredEmoji(emoji.code)}
                  onMouseLeave={() => setHoveredEmoji(null)}
                >
                  <Card
                    className={`bg-background hover:shadow-md transition-all duration-300 overflow-hidden ${
                      hoveredEmoji === emoji.code ? "ring-1 ring-primary border-primary/20" : "border-border/50"
                    }`}
                  >
                    <div className="p-4 flex flex-col items-center text-center relative">
                      <div
                        className="text-4xl mb-3 cursor-pointer hover:scale-125 transition-all duration-200 ease-in-out"
                        onClick={() => copyToClipboard(emoji.emoji, "emoji")}
                        title="Click to copy emoji"
                      >
                        {emoji.emoji}
                      </div>
                      <div
                        className="text-xs font-mono text-primary mb-2 cursor-pointer group/code relative px-2 py-1 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors"
                        onClick={() => copyToClipboard(emoji.code, "code")}
                        title="Click to copy code"
                      >
                        {emoji.code}
                      </div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-1">{emoji.description}</div>

                      {/* Category badge */}
                      <div className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {emoji.category}
                      </div>

                      {/* Copy feedback */}
                      {copiedEmoji === `${emoji.emoji}-emoji` && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center text-primary font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md shadow-sm">
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </div>
                        </motion.div>
                      )}
                      {copiedEmoji === `${emoji.code}-code` && (
                        <motion.div
                          className="absolute inset-0 bg-primary/10 backdrop-blur-sm flex items-center justify-center text-primary font-medium"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <div className="flex items-center gap-1.5 bg-background px-3 py-1.5 rounded-md shadow-sm">
                            <Check className="h-4 w-4" />
                            <span>Copied!</span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground bg-muted/10 rounded-xl border border-border/30">
              <div className="flex flex-col items-center">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{
                    rotate: [0, -10, 10, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatDelay: 1,
                  }}
                >
                  🔍
                </motion.div>
                <h3 className="text-xl font-medium mb-2">No emojis found</h3>
                <p className="text-sm max-w-md mx-auto">
                  We couldn't find any emojis matching your current filters. Try adjusting your search or selecting a
                  different category.
                </p>
                <Button
                  variant="outline"
                  className="mt-6"
                  onClick={() => {
                    setSearchTerm("")
                    setActiveCategory("all")
                  }}
                >
                  Reset all filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Guide */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
          <span className="text-xl">💡</span>
          <span>How to Use Commit Emojis</span>
        </h3>

        <div className="space-y-4">
          <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Format</h4>
            <div className="font-mono text-sm bg-background p-3 rounded-md">
              <span className="text-primary">emoji</span> <span className="text-muted-foreground">commit message</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Place the emoji at the beginning of your commit message, followed by a space.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">✨</span>
                <span className="text-sm font-medium">New Features</span>
              </div>
              <div className="font-mono text-xs bg-background p-2 rounded-md">✨ Add user authentication</div>
            </div>

            <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">🐛</span>
                <span className="text-sm font-medium">Bug Fixes</span>
              </div>
              <div className="font-mono text-xs bg-background p-2 rounded-md">🐛 Fix login redirect issue</div>
            </div>

            <div className="bg-muted/20 border border-border/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">♻️</span>
                <span className="text-sm font-medium">Refactoring</span>
              </div>
              <div className="font-mono text-xs bg-background p-2 rounded-md">♻️ Refactor API client</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

