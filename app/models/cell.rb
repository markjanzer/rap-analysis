class Cell < ActiveRecord::Base
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
end
