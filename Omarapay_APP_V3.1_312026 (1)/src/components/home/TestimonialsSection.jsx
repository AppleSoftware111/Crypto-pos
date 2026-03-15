import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    quote: "Omara Payments transformed our checkout process. Our customers love the speed and reliability, and we've seen a 30% increase in transaction volume.",
    author: "Sarah Johnson",
    position: "CEO, Retail Solutions Inc.",
    rating: 5
  },
  {
    quote: "The analytics dashboard has given us insights we never had before. We can now make data-driven decisions that have significantly improved our bottom line.",
    author: "Michael Chen",
    position: "Operations Director, Urban Eats",
    rating: 5
  },
  {
    quote: "Switching to Omara was the best business decision we made last year. Their customer service is exceptional, and the payment processing is flawless.",
    author: "Jessica Williams",
    position: "Owner, Wellness Studio",
    rating: 5
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 gradient-bg text-white">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Clients Say</h2>
          <p className="text-lg text-white/80">
            Don't just take our word for it. Here's what businesses like yours have experienced with Omara Payments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="glass-card rounded-xl p-8 relative"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <blockquote className="text-lg mb-6">"{testimonial.quote}"</blockquote>
              
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                  <span className="text-xl font-bold">{testimonial.author.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-white/70">{testimonial.position}</p>
                </div>
              </div>
              
              {/* Decorative quote mark */}
              <div className="absolute top-6 right-6 text-6xl text-white/10 font-serif">"</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;