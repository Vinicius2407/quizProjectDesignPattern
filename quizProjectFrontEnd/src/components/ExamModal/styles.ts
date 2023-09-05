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

      select,
      .select {
        width: 100%;
      }

      input,
      textarea,
      select,
      .select {
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

    .questions-container {
      margin-top: 3rem;

      .question-container {
        margin-top: 1rem;

        border: 1px solid #a1a1a1;
        border-radius: 0.25rem;
        padding: 1rem;

        .question-header {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;

          .question-card {
            background: var(--green);
            color: var(--background);
            padding: 0.2rem 0.5rem;
            border-radius: 1rem;
          }
        }

        span {
          font-weight: 600;
        }

        .grade {
          margin-left: 0.5rem;

          input {
            width: 60px;
            border-radius: 4px;
            border: 1px solid #a1a1a1;
            padding: 0.2rem;
          }
        }

        .answer {
          border: 1px solid #a1a1a1;
          border-radius: 0.25rem;
          padding: 1rem;
          margin-top: 0.5rem;
        }

        .commentary {
          margin-top: 0.5rem;

          textarea {
            margin: 0.5rem 0 0;
            width: 100%;
            max-height: 200px;
            min-height: 48px;
            resize: vertical;
            padding: 0.5rem;
          }

          &.optional {
            position: relative;

            &::after {
              content: "(opcional)";
              position: absolute;
              top: 0.1rem;
              left: 6.1rem;
              font-size: 0.8rem;
              color: var(--green);
            }
          }
        }

        .alternatives-container {
          margin: 0.5rem 0 0 0.5rem;

          .alternative {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin: 0.3rem 0;
          }
        }
      }
    }
  }

  .row {
    display: flex;
    align-items: center;
    gap: 1rem;

    &.diff {
      display: grid;
      grid-template-columns: 3fr 1fr;
      align-items: center;

      .input-container {
        margin: 0;

        &:last-child {
          margin-top: 0.08rem;
        }
      }
    }

    &.end {
      margin-top: 2rem;
      justify-content: flex-end;
    }
  }

  .tags-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem 4rem;

    padding: 0 0.5rem;

    .tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        height: 30px;
        width: 30px;
      }

      label {
        padding: 0;
        margin: 0;
        font-size: 1rem;
        font-weight: 400;
      }
    }
  }

  .options-row {
    margin-top: 1rem;
    display: grid;
    grid-template-columns: repeat(2, 2fr);

    .input-container {
      margin: 0;

      &:last-child {
        margin-top: 0.08rem;
      }
    }
  }

  .options-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 0 0.5rem;

    .option {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input {
        height: 30px;
        width: 30px;
      }

      label {
        padding: 0;
        margin: 0;
        font-size: 1rem;
        font-weight: 400;
      }
    }
  }
`;
