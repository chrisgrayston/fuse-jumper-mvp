export interface TouchState {
  left: boolean;
  right: boolean;
  jumpPressed: boolean;
  jumpHeld: boolean;
}

const state: TouchState = {
  left: false,
  right: false,
  jumpPressed: false,
  jumpHeld: false,
};

function wire(id: string, onDown: () => void, onUp: () => void): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('touchstart',  (e) => { e.preventDefault(); onDown(); }, { passive: false });
  el.addEventListener('touchend',    (e) => { e.preventDefault(); onUp();   }, { passive: false });
  el.addEventListener('touchcancel', (e) => { e.preventDefault(); onUp();   }, { passive: false });
  el.addEventListener('mousedown',   (e) => { e.preventDefault(); onDown(); });
  el.addEventListener('mouseup',     (e) => { e.preventDefault(); onUp();   });
  el.addEventListener('mouseleave',  (e) => { e.preventDefault(); onUp();   });
}

export function initTouchInput(): void {
  wire('btn-left',
    () => { state.left = true; },
    () => { state.left = false; },
  );
  wire('btn-right',
    () => { state.right = true; },
    () => { state.right = false; },
  );
  wire('btn-jump',
    () => { state.jumpPressed = true; state.jumpHeld = true; },
    () => { state.jumpHeld = false; },
  );
}

export function getTouchState(): Readonly<TouchState> {
  return state;
}

export function consumeJumpPressed(): void {
  state.jumpPressed = false;
}
