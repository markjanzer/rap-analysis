class Cell < ActiveRecord::Base
  # Makes html cells easier (maybe)
  def html(attribute)
    case attribute
    when "stressed"
      if this.stressed
        return "stressed"
      else
        return ""
      end
    when "end_rhyme"
      if this.end_rhyme
        return "end-rhyme"
      else
        return ""
      end
    end
  end
end
