// --- Imports ---
// useState lets us store values that change (like form inputs)
import { useState } from 'react';
// supabase is our database — we use it to save the inquiry
import { supabase } from '../lib/supabase';
// useAuth gives us the currently logged-in user's info
import { useAuth } from '../lib/auth';

// --- Component ---
// This is the pop-up (modal) that appears when a buyer clicks "Contact Seller" on a listing.
// It receives two things:
//   - listing: the crop listing the buyer is interested in (crop name, price, seller info, etc.)
//   - onClose: a function to close this modal when we're done
export function ContactSellerModal({ listing, onClose }: { listing: any, onClose: () => void }) {

    // quantity = how many kg (or units) the buyer wants to buy
    const [quantity, setQuantity] = useState('');

    // message = optional note from the buyer to the seller (e.g., "deliver by tomorrow")
    const [message, setMessage] = useState('');

    // submitting = true while we're waiting for the database to save — prevents double-clicks
    const [submitting, setSubmitting] = useState(false);

    // Get the logged-in user from the auth system
    const { user } = useAuth();

    // --- handleSubmit ---
    // This runs when the buyer clicks the "Send Inquiry" button.
    async function handleSubmit() {

        // Safety check: if the buyer is not logged in, stop here and show a message
        if (!user) {
            alert("You need to be logged in to contact sellers!");
            return;
        }

        // Show a loading state so the button is disabled while saving
        setSubmitting(true);

        // Save the inquiry to the "inquiries" table in Supabase (our database).
        // We store: which listing, who the seller is, who the buyer is, how much they want, and the message.
        const { error } = await supabase.from('inquiries').insert({
            listing_id: listing.id,               // which listing this inquiry is for
            seller_id: listing.seller_id,         // the farmer/vendor who posted the listing
            buyer_id: user.id,                    // the logged-in buyer making the request
            quantity_requested: Number(quantity), // convert the text input to a proper number
            message: message || null,             // if message is empty, store null instead of ""
        });

        // Done waiting — re-enable the button
        setSubmitting(false);

        if (error) {
            // Something went wrong on the database side — show an error to the user
            console.error("Error sending inquiry:", error);
            alert("Failed to send order. Try again.");
        } else {
            // Success! Tell the buyer and close the modal
            alert("Order sent to farmer successfully! 🚀");
            onClose();
        }
    }

    // --- UI (what the user sees) ---
    return (
        // Dark overlay that covers the whole screen behind the modal.
        // If the buyer clicks outside the white box, onClose() is called to dismiss it.
        <div
            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* The white modal box */}
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>

                {/* Header row: title on the left, X close button on the right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#166534' }}>Contact {listing.profiles?.name}</h3>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>&times;</button>
                </div>

                {/* Summary line showing what crop, price, and available stock */}
                <p style={{ fontSize: '0.875rem', color: '#4b5563', marginBottom: '16px' }}>
                    Requesting <strong>{listing.crop_id}</strong> at ₹{listing.price_per_unit}/{listing.unit}.<br />
                    <span style={{ fontSize: '0.75rem' }}>Available stock: {listing.quantity_available} {listing.unit}</span>
                </p>

                {/* Input: how many units does the buyer want? */}
                <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>Quantity Needed ({listing.unit})</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} // update state as the user types
                        placeholder={`Max ${listing.quantity_available}`}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Textarea: optional message from buyer to seller */}
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '4px' }}>Message (Optional)</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} // update state as the user types
                        placeholder="E.g., I need this delivered by tomorrow morning..."
                        rows={3}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box' }}
                    />
                </div>

                {/* Submit button — disabled if:
                    - currently submitting (already waiting for DB)
                    - quantity is empty
                    - quantity is 0 or negative
                    - quantity is more than what's available */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !quantity || Number(quantity) <= 0 || Number(quantity) > listing.quantity_available}
                    style={{ width: '100%', padding: '10px', backgroundColor: (submitting || !quantity) ? '#86efac' : '#16a34a', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: (submitting || !quantity) ? 'not-allowed' : 'pointer' }}
                >
                    {/* Button text changes based on whether we're currently submitting */}
                    {submitting ? 'Sending Request...' : 'Send Inquiry'}
                </button>

            </div>
        </div>
    );
}