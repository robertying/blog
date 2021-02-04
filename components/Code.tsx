import Highlight, { defaultProps, Language } from "prism-react-renderer";
import lightTheme from "prism-react-renderer/themes/nightOwlLight";
import darkTheme from "prism-react-renderer/themes/nightOwl";
import useMedia from "use-media";

const Code: React.FC<HTMLPreElement> = ({ children, className }) => {
  const language = className?.replace(/language-/, "");

  const darkMode = useMedia("(prefers-color-scheme: dark)");

  return (
    <Highlight
      {...defaultProps}
      theme={darkMode ? darkTheme : lightTheme}
      code={children as string}
      language={language as Language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <code className={className} style={style}>
          {tokens.slice(0, tokens.length - 1).map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </code>
      )}
    </Highlight>
  );
};

export default Code;
