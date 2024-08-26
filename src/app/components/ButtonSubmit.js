import React, { useState } from 'react';

function useFormStatus() {
  const [pending, setPending] = useState(false);

  const startSubmitting = () => setPending(true);
  const stopSubmitting = () => setPending(false);

  return { pending, startSubmitting, stopSubmitting };
}

function ButtonSubmit({ value, ...props }) {
  const { pending, startSubmitting, stopSubmitting } = useFormStatus();

  const handleSubmit = async (e) => {
    e.preventDefault();
    startSubmitting();

    // Simulate form submission
    setTimeout(() => {
      stopSubmitting();
    }, 2000);
  };

  return (
    <button type='submit' disabled={pending} onClick={handleSubmit} {...props}>
      {pending ? 'Loading...' : value}
    </button>
  );
}

export default ButtonSubmit;
