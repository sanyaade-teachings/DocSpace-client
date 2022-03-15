namespace Textile.Blocks;

public abstract class PhraseBlockModifier : BlockModifier
{
    protected PhraseBlockModifier()
    {
    }

    protected string PhraseModifierFormat(string input, string modifier, string tag)
    {
        // All phrase modifiers are one character, or a double character. Sometimes,
        // there's an additional escape character for the regex ('\').
        var compressedModifier = modifier;
        if (modifier.Length == 4)
        {
            compressedModifier = modifier.Substring(0, 2);
        }
        else if (modifier.Length == 2)
        {
            if (modifier[0] != '\\')
                compressedModifier = modifier[0].ToString();
            //else: compressedModifier = modifier;
        }
        //else: compressedModifier = modifier;

        // We try to remove the Textile tag used for the formatting from
        // the punctuation pattern, so that we match the end of the formatted
        // zone correctly.
        var punctuationPattern = Globals.PunctuationPattern.Replace(compressedModifier, "");

        // Now we can do the replacement.
        var pmme = new PhraseModifierMatchEvaluator(tag);
        var res = Regex.Replace(input,
                                        @"(?<=\s|" + punctuationPattern + @"|[{\(\[]|^)" +
                                        modifier +
                                        Globals.BlockModifiersPattern +
                                        @"(:(?<cite>(\S+)))?" +
                                        @"(?<content>[^" + compressedModifier + "]*)" +
                                        @"(?<end>" + punctuationPattern + @"*)" +
                                        modifier +
                                        @"(?=[\]\)}]|" + punctuationPattern + @"+|\s|$)",
                                    new MatchEvaluator(pmme.MatchEvaluator)
                                    );
        return res;
    }

    private sealed class PhraseModifierMatchEvaluator
    {
        private readonly string _tag;

        public PhraseModifierMatchEvaluator(string tag)
        {
            _tag = tag;
        }

        public string MatchEvaluator(Match m)
        {
            if (m.Groups["content"].Length == 0)
            {
                // It's possible that the "atts" match groups eats the contents
                // when the user didn't want to give block attributes, but the content
                // happens to match the syntax. For example: "*(blah)*".
                if (m.Groups["atts"].Length == 0)
                    return m.ToString();
                return "<" + _tag + ">" + m.Groups["atts"].Value + m.Groups["end"].Value + "</" + _tag + ">";
            }

            var atts = BlockAttributesParser.ParseBlockAttributes(m.Groups["atts"].Value, _tag);
            if (m.Groups["cite"].Length > 0)
                atts += " cite=\"" + m.Groups["cite"] + "\"";

            var res = "<" + _tag + atts + ">" +
                            m.Groups["content"].Value + m.Groups["end"].Value +
                            "</" + _tag + ">";
            return res;
        }
    }
}
