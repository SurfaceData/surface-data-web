import type { Contribution } from '@features/contributions';

export function sendContribution(
  contribution: Contribution,
  onError: (error: any) => void,
  onDone: () => void) {
  fetch('/api/submit-contribution', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contribution)
  })
    .then(response => {
      onDone();
    })
  .catch(error => {
    onError(error);
  });
}
