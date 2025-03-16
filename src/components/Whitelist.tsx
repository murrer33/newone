import React, { useState } from 'react';

const Whitelist: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your whitelist logic here
    alert('Thank you for joining our whitelist! We will contact you at ' + email);
    setEmail('');
  };

  return (
    <section id="whitelist" className="whitelist">
      <h2>Whitelist</h2>
      <div className="whitelist-content">
        <p>Join our exclusive whitelist to get early access to our platform.</p>
        <form className="whitelist-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Join Whitelist</button>
        </form>
      </div>
    </section>
  );
};

export default Whitelist; 