import styled from "styled-components";

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 0;

  > p,
  h2,
  h3 {
    margin: 1rem 0.5rem;
    line-height: 1.25rem;
  }

  .grade {
    background: var(--green);
    padding: 0.5rem;
    border-radius: 1rem;
    color: var(--background);
    display: inline-block;
    margin-bottom: 1rem;
  }

  .content {
    /* border: 1px solid #a1a1a1; */
    border-radius: 0.25rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #fff;
    box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.2);

    .question {
      &:not(:last-child) {
        border-bottom: 1px solid #a1a1a1;
        padding-bottom: 1rem;
      }

      span:first-child {
        font-weight: 600;
      }

      .grade {
        background: var(--green);
        padding: 0.2rem 0.5rem;
        border-radius: 1rem;
        color: var(--background);
        display: inline-block;
        margin-bottom: 0.5rem;
      }

      .commentary {
        margin-top: 1rem;
        span {
          border: 1px solid #a1a1a1;
          padding: 0.2rem;
          border-radius: 4px;
          display: inline-block;
          margin-top: 0.5rem;
          width: 100%;
        }
      }

      > textarea {
        margin: 1rem 0 0;
        width: 100%;
        max-height: 200px;
        min-height: 48px;
        resize: vertical;
        padding: 0.5rem;
      }

      .alternatives {
        margin: 1rem 0 0 0.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        border-radius: 4px;

        div {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          /* justify-content: space-between; */
          padding: 0.2rem;

          input {
            width: 15px;
            height: 15px;
          }
        }
      }
    }
  }
`;
