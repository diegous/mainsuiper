const Header = {
  render: async () => {
    return `
      <p>
        <a href="https://github.com/diegous/minesweeper">GitHub</a>
      </p>
    `;
  },
  afterRender: async () => {
  }
}

export default Header;
