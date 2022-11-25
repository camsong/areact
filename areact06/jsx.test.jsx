import { describe, it, expect, vi } from 'vitest';
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

describe('Hooks', () => {
  it('should support useState', async () => {
    const container = document.createElement('div');
    const globalObj = {};

    function App() {
      const [count, setCount] = AReact.useState(100);
      globalObj.count = count;
      globalObj.setCount = setCount;

      return <div>{count}</div>;
    }
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(<App />);
    });
    await act(() => {
      globalObj.setCount((count) => count + 1);
    });
    await act(() => {
      globalObj.setCount(globalObj.count + 1);
    });
    expect(globalObj.count).toBe(102);
  });

  it('should support useReducer', async () => {
    const container = document.createElement('div');
    const globalObj = {};

    function reducer(state, action) {
      switch (action.type) {
        case 'add':
          return state + 1;
        case 'sub':
          return state - 1;
      }
    }

    function App() {
      const [count, dispatch] = AReact.useReducer(reducer, 100);
      globalObj.count = count;
      globalObj.dispatch = dispatch;

      return <div>{count}</div>;
    }
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(<App />);
    });
    await act(() => {
      globalObj.dispatch({ type: 'add' });
      globalObj.dispatch({ type: 'add' });
    });
    expect(globalObj.count).toBe(102);
  });
});

describe('event binding', () => {
  it('should support event binding', async () => {
    const container = document.createElement('div');
    const globalObj = {
      increase: (count) => count + 1,
    };

    const increaseSpy = vi.spyOn(globalObj, 'increase');

    function App() {
      const [count, setCount] = AReact.useState(100);

      return (
        <div>
          {count}
          <button onClick={() => setCount(globalObj.increase)}></button>
        </div>
      );
    }
    const root = AReact.createRoot(container);
    await act(() => {
      root.render(<App />);
    });
    expect(increaseSpy).not.toBeCalled();
    await act(() => {
      container.querySelectorAll('button')[0].click();
      container.querySelectorAll('button')[0].click();
    });
    expect(increaseSpy).toBeCalledTimes(2);
  });
});
