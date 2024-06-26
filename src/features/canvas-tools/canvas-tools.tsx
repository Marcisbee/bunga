import { useStore } from 'exome/react';
import { useLayoutEffect, useState } from 'react';

import { interactiveModeStore } from '../../store/interactive-mode.store';
import { undoStore } from '../../store/undo.store';
import { cc } from '../../utils/class-names';
import { EdgeSelectorComponent } from '../edge-selector/edge-selector';

import style from './canvas-tools.module.scss';
import { canvasToolsStore, CanvasTools } from './canvas-tools.store';

function CanvasUndoRedo() {
  const {
    undo,
    redo,
    canUndo,
    canRedo,
  } = useStore(undoStore);

  return (
    <div className={style.group}>
      <button
        type="button"
        className={style.tool}
        onClick={undo}
        disabled={!canUndo}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M18.885 3.515c-4.617-4.618-12.056-4.676-16.756-.195l-2.129-2.258v7.938h7.484l-2.066-2.191c2.82-2.706 7.297-2.676 10.073.1 4.341 4.341 1.737 12.291-5.491 12.291v4.8c3.708 0 6.614-1.244 8.885-3.515 4.686-4.686 4.686-12.284 0-16.97z" /></svg>
      </button>

      <button
        type="button"
        className={style.tool}
        onClick={redo}
        disabled={!canRedo}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M5.115 3.515c4.617-4.618 12.056-4.676 16.756-.195l2.129-2.258v7.938h-7.484l2.066-2.191c-2.82-2.706-7.297-2.676-10.073.1-4.341 4.341-1.737 12.291 5.491 12.291v4.8c-3.708 0-6.614-1.244-8.885-3.515-4.686-4.686-4.686-12.284 0-16.97z" /></svg>
      </button>
    </div>
  );
}

function CanvasToolsCursorsComponent() {
  const { activeTool, setActiveTool } = useStore(canvasToolsStore);

  return (
    <div className={style.cursors}>
      <div className={style.group}>
        {Object.entries(CanvasTools).map(([key, tool]) => (
          <button
            key={`c-t-${key}`}
            type="button"
            className={cc([
              style.tool,
              activeTool === key && style.active,
            ])}
            onClick={() => {
              setActiveTool(key as unknown as keyof typeof CanvasTools);
            }}
          >
            {tool === 'move' && (
              <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M10.1102 4.57278L0.750153 0.320007L2.96394 10.3597L5.66901 6.39429L10.1102 4.57278Z" fill="currentColor" />
              </svg>
            )}

            {tool === 'grab' && (
              <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_32_5)">
                  <mask id="path-1-outside-1_32_5" maskUnits="userSpaceOnUse" x="3" y="2" width="15" height="16" fill="black">
                    <rect fill="white" x="3" y="2" width="15" height="16" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M14 17L13 15L12 17H8V15.9635C8 15.1447 4.79985 12.8634 4.79985 12.8634C4.3581 12.5352 4 11.8277 4 11.2704V7.66667C4 6.52126 4.8955 5.59259 6 5.59259V8.7037H7V3.86437C7 3.38681 7.373 3 7.8335 3C8.754 3 9.5 3.77363 9.5 4.72822V4.38289C9.5 3.90533 9.873 3.51852 10.3335 3.51852C11.254 3.51852 12 4.29215 12 5.24674V4.90141C12 4.42385 12.373 4.03704 12.8335 4C13.754 4.03704 14.5 4.81067 14.5 5.76526V5.41993C14.5 4.94237 14.873 4.55556 15.3335 4.55556C16.254 4.55556 17 5.32919 17 6.28378V11.0043C17 11.5542 16.7627 12.3812 16.4745 12.8573C16.4745 12.8573 15 15.1447 15 15.9635V17H14ZM10 9H11V13H10V9ZM12 9H13V13H12V9ZM14 9H15V13H14V9Z" />
                  </mask>
                  <path fillRule="evenodd" clipRule="evenodd" d="M14 17L13 15L12 17H8V15.9635C8 15.1447 4.79985 12.8634 4.79985 12.8634C4.3581 12.5352 4 11.8277 4 11.2704V7.66667C4 6.52126 4.8955 5.59259 6 5.59259V8.7037H7V3.86437C7 3.38681 7.373 3 7.8335 3C8.754 3 9.5 3.77363 9.5 4.72822V4.38289C9.5 3.90533 9.873 3.51852 10.3335 3.51852C11.254 3.51852 12 4.29215 12 5.24674V4.90141C12 4.42385 12.373 4.03704 12.8335 4C13.754 4.03704 14.5 4.81067 14.5 5.76526V5.41993C14.5 4.94237 14.873 4.55556 15.3335 4.55556C16.254 4.55556 17 5.32919 17 6.28378V11.0043C17 11.5542 16.7627 12.3812 16.4745 12.8573C16.4745 12.8573 15 15.1447 15 15.9635V17H14ZM10 9H11V13H10V9ZM12 9H13V13H12V9ZM14 9H15V13H14V9Z" fill="white" />
                  <path d="M14 17L13.1056 17.4472L13.382 18H14V17ZM13 15L13.8944 14.5528L13 12.7639L12.1056 14.5528L13 15ZM12 17V18H12.618L12.8944 17.4472L12 17ZM8 17H7V18H8V17ZM4.79985 12.8634L4.20337 13.6661L4.21131 13.672L4.21937 13.6777L4.79985 12.8634ZM6 5.59259H7V4.59259H6V5.59259ZM6 8.7037H5V9.7037H6V8.7037ZM7 8.7037V9.7037H8V8.7037H7ZM12.8335 4L12.8737 3.00081L12.8134 2.99838L12.7533 3.00322L12.8335 4ZM16.4745 12.8573L17.315 13.3991L17.3227 13.3872L17.33 13.3751L16.4745 12.8573ZM15 17V18H16V17H15ZM11 9H12V8H11V9ZM11 13V14H12V13H11ZM10 13H9V14H10V13ZM13 9H14V8H13V9ZM13 13V14H14V13H13ZM12 13H11V14H12V13ZM15 9H16V8H15V9ZM15 13V14H16V13H15ZM14 13H13V14H14V13ZM14.8944 16.5528L13.8944 14.5528L12.1056 15.4472L13.1056 17.4472L14.8944 16.5528ZM12.1056 14.5528L11.1056 16.5528L12.8944 17.4472L13.8944 15.4472L12.1056 14.5528ZM12 16H8V18H12V16ZM9 17V15.9635H7V17H9ZM9 15.9635C9 15.5743 8.82636 15.2516 8.71172 15.0672C8.57922 14.8541 8.40973 14.6472 8.23889 14.4599C7.89497 14.0827 7.45602 13.6879 7.04347 13.341C6.6258 12.9899 6.21111 12.6678 5.90268 12.4348C5.74793 12.3179 5.61867 12.2224 5.52757 12.1558C5.48199 12.1225 5.44589 12.0963 5.42084 12.0783C5.40831 12.0692 5.39854 12.0622 5.39172 12.0573C5.38831 12.0549 5.38564 12.053 5.38374 12.0516C5.38278 12.0509 5.38202 12.0504 5.38145 12.05C5.38116 12.0498 5.38093 12.0496 5.38074 12.0495C5.38064 12.0494 5.38054 12.0493 5.38049 12.0493C5.3804 12.0492 5.38032 12.0492 4.79985 12.8634C4.21937 13.6777 4.21932 13.6777 4.21927 13.6777C4.21927 13.6777 4.21924 13.6776 4.21925 13.6776C4.21925 13.6776 4.21931 13.6777 4.21941 13.6778C4.21962 13.6779 4.22001 13.6782 4.2206 13.6786C4.22176 13.6794 4.22368 13.6808 4.22633 13.6827C4.23162 13.6865 4.23982 13.6924 4.25073 13.7003C4.27256 13.716 4.30521 13.7397 4.34714 13.7703C4.43104 13.8317 4.5518 13.9208 4.69706 14.0306C4.98865 14.2509 5.37401 14.5503 5.75638 14.8718C6.14386 15.1976 6.50495 15.5266 6.76106 15.8075C6.89024 15.9492 6.97076 16.0549 7.01326 16.1232C7.07364 16.2203 7 16.148 7 15.9635H9ZM5.39632 12.0608C5.33205 12.013 5.22228 11.8915 5.1275 11.7032C5.03284 11.5152 5 11.3536 5 11.2704H3C3 11.7445 3.14621 12.2154 3.34104 12.6024C3.53574 12.9892 3.8259 13.3856 4.20337 13.6661L5.39632 12.0608ZM5 11.2704V7.66667H3V11.2704H5ZM5 7.66667C5 7.03895 5.48175 6.59259 6 6.59259V4.59259C4.30925 4.59259 3 6.00356 3 7.66667H5ZM5 5.59259V8.7037H7V5.59259H5ZM6 9.7037H7V7.7037H6V9.7037ZM8 8.7037V3.86437H6V8.7037H8ZM8 3.86437C8 3.88955 7.9893 3.92091 7.96391 3.94724C7.93789 3.97422 7.8911 4 7.8335 4V2C6.78675 2 6 2.86912 6 3.86437H8ZM7.8335 4C8.16775 4 8.5 4.29132 8.5 4.72822H10.5C10.5 3.25593 9.34025 2 7.8335 2V4ZM10.5 4.72822V4.38289H8.5V4.72822H10.5ZM10.5 4.38289C10.5 4.40807 10.4893 4.43942 10.4639 4.46576C10.4379 4.49274 10.3911 4.51852 10.3335 4.51852V2.51852C9.28675 2.51852 8.5 3.38764 8.5 4.38289H10.5ZM10.3335 4.51852C10.6677 4.51852 11 4.80984 11 5.24674H13C13 3.77445 11.8403 2.51852 10.3335 2.51852V4.51852ZM13 5.24674V4.90141H11V5.24674H13ZM13 4.90141C13 4.92906 12.9879 4.95417 12.9739 4.96909C12.9616 4.98231 12.9412 4.99456 12.9137 4.99678L12.7533 3.00322C11.7867 3.08096 11 3.88932 11 4.90141H13ZM12.7933 4.99919C13.1676 5.01425 13.5 5.33728 13.5 5.76526H15.5C15.5 4.28406 14.3404 3.05982 12.8737 3.00081L12.7933 4.99919ZM15.5 5.76526V5.41993H13.5V5.76526H15.5ZM15.5 5.41993C15.5 5.4451 15.4893 5.47646 15.4639 5.50279C15.4379 5.52978 15.3911 5.55556 15.3335 5.55556V3.55556C14.2867 3.55556 13.5 4.42468 13.5 5.41993H15.5ZM15.3335 5.55556C15.6677 5.55556 16 5.84688 16 6.28378H18C18 4.81149 16.8403 3.55556 15.3335 3.55556V5.55556ZM16 6.28378V11.0043H18V6.28378H16ZM16 11.0043C16 11.1564 15.9634 11.404 15.8835 11.6847C15.804 11.9642 15.7031 12.2006 15.6191 12.3394L17.33 13.3751C17.5341 13.0379 17.696 12.6227 17.8071 12.2322C17.9179 11.843 18 11.4021 18 11.0043H16ZM16.4745 12.8573C15.634 12.3155 15.634 12.3156 15.6339 12.3156C15.6339 12.3157 15.6338 12.3158 15.6338 12.3159C15.6337 12.316 15.6335 12.3162 15.6334 12.3164C15.6331 12.3169 15.6327 12.3175 15.6322 12.3182C15.6313 12.3197 15.63 12.3217 15.6284 12.3243C15.6251 12.3294 15.6205 12.3366 15.6146 12.3459C15.6027 12.3645 15.5858 12.3911 15.5645 12.425C15.522 12.4927 15.4618 12.5895 15.3898 12.7078C15.2463 12.9436 15.0537 13.269 14.8598 13.6236C14.6677 13.9751 14.4653 14.3715 14.3082 14.7459C14.1691 15.0776 14 15.5388 14 15.9635H16C16 15.9788 16.0152 15.847 16.1526 15.5195C16.272 15.2348 16.4382 14.9058 16.6147 14.5831C16.7894 14.2635 16.9654 13.9659 17.0985 13.7472C17.1647 13.6383 17.2197 13.5499 17.2578 13.4893C17.2768 13.4591 17.2916 13.4358 17.3014 13.4204C17.3063 13.4128 17.3099 13.4071 17.3122 13.4035C17.3134 13.4017 17.3142 13.4004 17.3147 13.3997C17.3149 13.3993 17.315 13.3991 17.3151 13.399C17.3151 13.3989 17.3151 13.3989 17.3151 13.3989C17.3151 13.3989 17.3151 13.399 17.3151 13.399C17.3151 13.399 17.315 13.3991 16.4745 12.8573ZM14 15.9635V17H16V15.9635H14ZM15 16H14V18H15V16ZM10 10H11V8H10V10ZM10 9V13H12V9H10ZM11 12H10V14H11V12ZM11 13V9H9V13H11ZM12 10H13V8H12V10ZM12 9V13H14V9H12ZM13 12H12V14H13V12ZM13 13V9H11V13H13ZM14 10H15V8H14V10ZM14 9V13H16V9H14ZM15 12H14V14H15V12ZM15 13V9H13V13H15Z" fill="black" fillOpacity="0.8" mask="url(#path-1-outside-1_32_5)" />
                </g>
                <defs>
                  <filter id="filter0_d_32_5" x="0" y="0" width="21" height="22" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix" />
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                    <feOffset dy="1" />
                    <feGaussianBlur stdDeviation="1.5" />
                    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0" />
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_32_5" />
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_32_5" result="shape" />
                  </filter>
                </defs>
              </svg>
            )}
          </button>
        ))}
      </div>

      <CanvasUndoRedo />
    </div>
  );
}

function CanvasToolsInteractiveComponent() {
  const { isInteractive, setInteractive } = useStore(interactiveModeStore);

  return (
    <div className={style.interactive}>
      <div className={style.group}>
        <button
          type="button"
          className={cc([
            style.tool,
            isInteractive && style.active,
          ])}
          onClick={() => {
            setInteractive(!isInteractive);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 8 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5L0.5 9.33013L0.5 0.669872L8 5Z" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function CanvasToolsEdgeSelectorComponent() {
  const [isOpen, setIsOpen] = useState(false);

  useLayoutEffect(() => {
    const handler = isOpen
      ? (e: KeyboardEvent) => {
        // Close

        if (e.key === 'Escape') {
          e.stopPropagation();
          setIsOpen(false);
        }
      }
      : (e: KeyboardEvent) => {
        // Open with cmd+k
        if (e.key === 'k' && e.metaKey) {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }
      };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [isOpen]);

  return (
    <>
      <div className={style.edgeSelector}>
        <div className={style.group}>
          <button
            type="button"
            className={cc([
              style.tool,
            ])}
            onClick={() => {
              setIsOpen((s) => !s);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"><path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" /></svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <EdgeSelectorComponent onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}

export function CanvasToolsComponent() {
  return (
    <>
      <CanvasToolsEdgeSelectorComponent />
      <CanvasToolsCursorsComponent />
      <CanvasToolsInteractiveComponent />
    </>
  );
}
