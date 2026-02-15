import { mergeAttributes, Node } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    emailToken: {
      insertEmailToken: (token: string) => ReturnType;
    };
  }
}

export const EmailToken = Node.create({
  name: 'emailToken',
  group: 'inline',
  inline: true,
  atom: true,
  selectable: false,

  addAttributes() {
    return {
      token: {
        default: ''
      }
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-ee-token]'
      }
    ];
  },

  renderHTML({ HTMLAttributes }) {
    const token = typeof HTMLAttributes.token === 'string' ? HTMLAttributes.token : '';

    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-ee-token': token,
        class: 'ee-token'
      }),
      token
    ];
  },

  addCommands() {
    return {
      insertEmailToken:
        (token: string) =>
        ({ chain }) => {
          return chain()
            .insertContent({
              type: this.name,
              attrs: {
                token
              }
            })
            .run();
        }
    };
  }
});
