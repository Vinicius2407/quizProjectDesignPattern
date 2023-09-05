import * as DialogPrimitive from "@radix-ui/react-dialog";
import styled, { keyframes } from "styled-components";

const showOverlay = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const Dialog = DialogPrimitive.Root;

export const DialogOverlay = styled(DialogPrimitive.Overlay)`
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  animation: ${showOverlay} 300ms ease-in-out;
`;

export const DialogContent = styled(DialogPrimitive.Content)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  outline: 0;

  padding: 1.5rem;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  background: var(--background);
  color: var(--primary);
  border-radius: 4px;
  animation: ${showOverlay} 150ms ease-in-out;

  overflow-y: auto;
  overflow-x: hidden;
  max-height: 600px;

  form {
    min-width: 800px;

    .input-container {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      label {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 0.5rem;

        &.optional {
          position: relative;

          &::after {
            content: "(opcional)";
            position: absolute;
            top: 0.2rem;
            left: 6.5rem;
            font-size: 0.8rem;
            color: var(--green);
          }
        }
      }

      textarea {
        resize: none;
        min-height: 2rem;
        max-height: 7.5rem;
      }

      select {
        width: 100%;
      }

      input,
      textarea,
      select {
        border: none;
        border-bottom: 2px solid #d1d1d1;
        background: transparent;
        color: var(--primary);
        font-size: 1.25rem;
        padding: 0 0.5rem 0.3rem;
        transition: border-color 0.2s ease-in-out;
        outline: 0;

        &:focus {
          border-color: var(--green);
        }
      }

      + .input-container {
        margin-top: 1.5rem;
      }
    }

    .alternatives-container {
      margin-top: 3rem;

      .add-button {
        border: none;
        border-radius: 0.25rem;
        background: var(--green);
        color: var(--background);
        padding: 0.2rem;
        position: relative;

        display: flex;
        align-items: center;
        justify-content: center;

        transition: filter 0.2s;

        svg {
          font-size: 1.5rem;
        }

        &:hover {
          filter: brightness(0.8);
        }

        &::after {
          content: "(Ctrl + Enter)";
          width: 100%;
          position: absolute;
          top: 0.2rem;
          left: 2.3rem;
          font-size: 0.8rem;
          color: var(--green);
          white-space: nowrap;
        }
      }

      .alternatives {
        margin-top: 1rem;
        display: grid;
        align-items: center;
        grid-template-columns: 0.3fr 7fr 3fr 1fr;

        border: 1px solid #a1a1a1;
        border-radius: 0.25rem;
        padding: 1rem;

        span:first-child {
          font-weight: 700;
        }

        textarea {
          border: none;
          background: transparent;
          font-size: 1.15rem;
          outline: 0;
          resize: none;
          min-height: 2rem;
          max-height: 7.5rem;
          border: 1px solid #a1a1a1;
          padding-top: 2.5px;
          border-radius: 0.25rem;
          padding: 0.5rem;
        }

        .checkbox-container {
          display: flex;
          justify-content: center;
          align-items: center;
          justify-self: flex-end;

          input {
            margin-right: 0.5rem;
            height: 30px;
            width: 30px;
          }
        }

        svg {
          justify-self: flex-end;
          cursor: pointer;
          color: var(--red);
          font-size: 1.5rem;
        }
      }
    }

    .row {
      display: flex;
      align-items: center;
      gap: 1rem;

      &.end {
        margin-top: 2rem;
        justify-content: flex-end;
      }
    }
  }
`;
