-- make the referral codes unique for both the user_id and codes columns
-- both need to be unique globally, not just per user

CREATE UNIQUE INDEX codes_unique ON public.referral_codes (code);
CREATE UNIQUE INDEX codes_user_id_unique ON public.referral_codes (user_id);
