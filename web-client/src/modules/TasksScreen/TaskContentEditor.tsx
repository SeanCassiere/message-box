import { useState, useRef } from "react";
import "./RichEditor.css";
import "draft-js/dist/Draft.css";

import { convertFromRaw, convertToRaw, Editor, EditorState, getDefaultKeyBinding, RichUtils } from "draft-js";
import { draftToMarkdown, markdownToDraft } from "markdown-draft-js";

import Box from "@mui/material/Box";

interface Props {
  initialContent: string;
  onChange: (content: string) => void;
}

const TaskContentEditor = (props: Props) => {
  const { initialContent, onChange } = props;
  const rawData = markdownToDraft(initialContent);
  const contentStateFromRaw = convertFromRaw(rawData);
  const newEditorState = EditorState.createWithContent(contentStateFromRaw);

  const [editorCurrentState, setEditorCurrentState] = useState(newEditorState);
  const editorRef = useRef<Editor>(null);

  function _handleKeyCommand(command: any, editorState: EditorState) {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorCurrentState(newState);
      return true;
    }
    return false;
  }

  function _mapKeyToEditorCommand(e: any) {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorCurrentState, 4 /* maxDepth */);
      if (newEditorState !== editorCurrentState) {
        setEditorCurrentState(newEditorState);
      }
      return;
    }
    return getDefaultKeyBinding(e);
  }

  function _toggleBlockType(blockType: string) {
    setEditorCurrentState(RichUtils.toggleBlockType(editorCurrentState, blockType));
  }

  function _toggleInlineStyle(inlineStyle: string) {
    setEditorCurrentState(RichUtils.toggleInlineStyle(editorCurrentState, inlineStyle));
  }

  function getBlockStyle(block: any) {
    switch (block.getType()) {
      case "blockquote":
        return "RichEditor-blockquote";
      default:
        return null;
    }
  }

  function focus() {
    editorRef.current!.focus();
  }

  function handleEditorContentChange(changingEditorState: EditorState) {
    setEditorCurrentState(changingEditorState);
    const contentFromEditor = changingEditorState.getCurrentContent();
    const rawObject = convertToRaw(contentFromEditor);
    const markdown = draftToMarkdown(rawObject);
    onChange(markdown);
  }

  let className = "RichEditor-editor";
  const contentState = editorCurrentState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  return (
    <div
      className="RichEditor-root"
      style={{
        height: "350px",
        overflowY: "auto",
        position: "relative",
        overflowX: "hidden",
        border: "1px solid #ddd",
        padding: "1rem 1rem",
      }}
    >
      <Box sx={{ position: "sticky", top: 0, borderBottom: "1px solid #ddd", bgcolor: "#fff", zIndex: 2 }}>
        <BlockStyleControls
          editorState={editorCurrentState}
          onToggleBlock={_toggleBlockType}
          onToggleInline={_toggleInlineStyle}
        />
        {/* <InlineStyleControls editorState={editorCurrentState} onToggle={_toggleInlineStyle} /> */}
      </Box>
      <div className={className} onClick={focus}>
        <Editor
          blockStyleFn={getBlockStyle as any}
          customStyleMap={styleMap}
          editorState={editorCurrentState}
          handleKeyCommand={_handleKeyCommand as any}
          keyBindingFn={_mapKeyToEditorCommand as any}
          onChange={handleEditorContentChange}
          ref={editorRef}
          spellCheck={true}
        />
      </div>
    </div>
  );
};

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
};

const INLINE_STYLES = [
  { label: "Bold", style: "BOLD" },
  { label: "Italic", style: "ITALIC" },
  { label: "Underline", style: "UNDERLINE" },
  { label: "Monospace", style: "CODE" },
];

const StyleButton = (props: any) => {
  const onToggle = (e: any) => {
    e.preventDefault();
    props.onToggle(props.style);
  };
  let className = "RichEditor-styleButton";
  if (props.active) {
    className += " RichEditor-activeButton";
  }
  return (
    <span className={className} onMouseDown={onToggle}>
      {props.label}
    </span>
  );
};

const BLOCK_TYPES = [
  { label: "H1", style: "header-two" },
  { label: "H2", style: "header-three" },
  { label: "H3", style: "header-four" },
  { label: "Blockquote", style: "blockquote" },
  { label: "UL", style: "unordered-list-item" },
  { label: "OL", style: "ordered-list-item" },
  { label: "Code Block", style: "code-block" },
];

const BlockStyleControls = (props: { editorState: EditorState; onToggleBlock: any; onToggleInline: any }) => {
  const { editorState } = props;
  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();
  const currentStyle = props.editorState.getCurrentInlineStyle();

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) => (
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggleBlock}
          style={type.style}
        />
      ))}
      {INLINE_STYLES.map((type) => (
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggleInline}
          style={type.style}
        />
      ))}
    </div>
  );
};

export default TaskContentEditor;
