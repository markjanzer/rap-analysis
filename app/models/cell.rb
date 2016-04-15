class Cell < ActiveRecord::Base
  belongs_to :measure

  # Makes html cells easier (maybe)
  def html(attribute)
    case attribute
    when "stressed"
      if self.stressed
        return "stressed"
      else
        return ""
      end
    when "end_rhyme"
      if self.end_rhyme
        return "end-rhyme"
      else
        return ""
      end
    end
  end
  # refactor move to a different place?
  def self.colors
    [
      { descriptor: "No Rhyme",
        phonetic_symbol: "",
        color_hex: "#FFFFFF" },
      { descriptor: "cat",
        phonetic_symbol: "&#xE6;",
        color_hex: "#D54E33" },
      { descriptor: "up",
        phonetic_symbol: "&#x39B;",
        color_hex: "#CE973E" },
      { descriptor: "toy",
        phonetic_symbol: "&#x0254;&#x026A;",
        color_hex: "#63572F" },
      { descriptor: "shoot",
        phonetic_symbol: "u",
        color_hex: "#C9D645" },
      { descriptor: "ship",
        phonetic_symbol: "&#x026A;",
        color_hex: "#588A39" },
      { descriptor: "sheep",
        phonetic_symbol: "i",
        color_hex: "#6CD85A" },
      { descriptor: "here",
        phonetic_symbol: "ir",
        color_hex: "#B5D392" },
      { descriptor: "bed",
        phonetic_symbol: "&#x025B;",
        color_hex: "#527C6A" },
      { descriptor: "bird",
        phonetic_symbol: "&#x025C;r",
        color_hex: "#7DD9C2" },
      { descriptor: "good",
        phonetic_symbol: "&#x028A;",
        color_hex: "#86B1D1" },
      { descriptor: "far",
        phonetic_symbol: "&#x0251;r",
        color_hex: "#595675" },
      { descriptor: "on",
        phonetic_symbol: "&#x0251;",
        color_hex: "#776FCC" },
      { descriptor: "my",
        phonetic_symbol: "a&#x026A;",
        color_hex: "#D29AC4" },
      { descriptor: "door",
        phonetic_symbol: "&#x0254;r",
        color_hex: "#D053CD" },
      { descriptor: "cow",
        phonetic_symbol: "a&#x028A;",
        color_hex: "#903C79" },
      { descriptor: "wait",
        phonetic_symbol: "e&#x026A;",
        color_hex: "#D74D76" },
      { descriptor: "show",
        phonetic_symbol: "o&#x028A;",
        color_hex: "#CCA18C" },
      { descriptor: "hair",
        phonetic_symbol: "&#x025B;r",
        color_hex: "#8F4236" }
    ]
  end

end