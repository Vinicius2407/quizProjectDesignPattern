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

      input {
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
