import { preprocessCSS } from 'vite';
import { describe, it, expect } from 'vitest';
import AReact from './AReact';
const act = AReact.act;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('AReact JSX', () => {
  it('should render jsx', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it('should render jsx with text', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar">hello</div>
        <button>Add</button>
      </div>
    );
    console.log(JSON.stringify(element));
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">hello</div><button>Add</button></div>'
    );
  });

  it('should render jsx with different props', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo" className="bar">
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
    });
    expect(container.innerHTML).toBe(
      '<div id="foo" class="bar"><button></button></div>'
    );
  });
});

describe('AReact Concurrent', () => {
  it('should render in async', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    root.render(element);
    expect(container.innerHTML).toBe('');
    await sleep(1000);
    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it('should render in async', async () => {
    const container = document.createElement('div');
    const element = (
      <div id="foo">
        <div id="bar"></div>
        <button></button>
      </div>
    );
    console.log(element);
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(element);
      expect(container.innerHTML).toBe('');
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });
});

describe('Function Component', () => {
  it('should render Function Component', async () => {
    const container = document.createElement('div');
    function App() {
      return (
        <div id="foo">
          <div id="bar"></div>
          <button></button>
        </div>
      );
    }
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(<App />);
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar"></div><button></button></div>'
    );
  });

  it('should render nested Function Component', async () => {
    const container = document.createElement('div');
    function App(props) {
      return (
        <div id="foo">
          <div id="bar">{props.title}</div>
          <button></button>
          {props.children}
        </div>
      );
    }
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(
        <App title="main title">
          <App title="sub title" />
        </App>
      );
    });

    expect(container.innerHTML).toBe(
      '<div id="foo"><div id="bar">main title</div><button></button><div id="foo"><div id="bar">sub title</div><button></button></div></div>'
    );
  });
});
