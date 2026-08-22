-- Clean up product names and write real descriptions

update products set name = '1 Side Hair Bonnet', description = 'Satin-lined bonnet that protects your style while you sleep.' where id = 'bc92e016-9e8b-4f71-a0ee-5ae4e5208e07';
update products set name = '3 in 1 Hair Bonnet', description = 'Versatile bonnet you can wear three ways for daily protection.' where id = '8e988781-7dce-4aa4-acba-cbbee0122610';
update products set name = 'Absolute Clear Lip Gloss', description = 'Clear, high-shine gloss for a soft and flawless finish.' where id = 'ed295e7c-566b-4ba3-89b9-765dd62d168a';
update products set name = 'Black, Brown Lip and Eye Liner Pencil', description = 'Smooth, long-lasting liner for bold and defined looks.' where id = '1162b56d-c6a0-4d7b-86d1-79d0132db8d5';
update products set name = 'Body Philosophy and Victoria Secret Body Splash 250ml', description = 'Refreshing body splashes for every mood and moment.' where id = '874e2935-7d43-46c0-81e6-14999f8c2d7b';
update products set name = 'Bodycology Fragrance Body Mist 237ml', description = 'Delicious, long-lasting scent you will love all day.' where id = '73386fb7-0e3c-42f4-9866-5f2169db8017';
update products set name = 'Detangling Hair Brush', description = 'Gentle bristles that glide through knots without breakage.' where id = '1e103c88-74f1-4d17-96b6-aba7f70f4559';
update products set name = 'Dome Mesh Wig Cap', description = 'Breathable mesh cap for a smooth and secure wig fit.' where id = '2415a984-084f-43a7-b536-78c88636df39';
update products set name = 'French Curls', description = 'French curl extensions for soft, bouncy braid ends.' where id = '7ffa4c77-c912-45fb-895c-1eac4be39b6e';
update products set name = 'Ginger Organic Hair Growth Oil', description = 'Warming ginger oil that nourishes the scalp and supports growth.' where id = 'a5d51058-ac4c-4d1f-bdb5-b4727ab8ce4f';
update products set name = 'Hair Scrunchies', description = 'Soft scrunchies in eight colours that hold without creasing.' where id = '944cd7dc-81f0-4a0e-8a72-24a4a3481b1a';
update products set name = 'Hair Styling Bow', description = 'Classic bow clip that finishes any updo in seconds.' where id = 'd4274b25-5db9-4568-874f-9c1c2e9fdd60';
update products set name = 'Hair Styling Claw Clip', description = 'Strong grip claw clip for effortless everyday styling.' where id = 'ebc7441f-06da-468d-9c2a-83df565ad785';
update products set name = 'Headband, Big Size', description = 'Wide, comfortable headband that stays put all day.' where id = '2420ae02-8e8a-4d88-8c24-e2350f5a31d6';
update products set name = 'Headband, Small Size', description = 'Slim headband for a neat finish on any style.' where id = 'a69c9c66-7d52-40c1-bba8-c5862936dc81';
update products set name = 'Jeba Oil Free Hair Deodorizer 120ml', description = 'Oil free formula that fights dandruff and soothes itching.' where id = 'b592ebc4-cbc7-40f6-ba71-37a289d559e9';
update products set name = 'Mass Styling Gel', description = 'Firm hold gel for sleek edges and lasting definition.' where id = '68c1786a-0188-4177-96b2-d80f893e1562';
update products set name = 'Moisturizing Fruity Lip Oil', description = 'Fruity lip oil that hydrates with a glossy finish.' where id = 'c7c4483d-9570-4bd3-a278-421d3d1fc9a3';
update products set name = 'Original Aifasi Hair Mousse 500ml', description = 'Rich mousse that sets curls with body and shine.' where id = '3ca8057a-59ea-42e5-bcba-580421325dd0';
update products set name = 'ORS Olive Oil Nourishing Sheen Spray 450ml', description = 'Olive oil sheen spray for instant shine and softness.' where id = 'cb25d25f-197d-4738-b543-87d97424cfe0';
update products set name = 'Professional Detangling Comb', description = 'Wide tooth comb that separates strands without pulling.' where id = 'ebd2a660-1b43-4418-9b77-0987e92fa576';
update products set name = 'Professional Apple Curl Keeper', description = 'Defines curls and keeps them springy through the day.' where id = '4cdb2952-0489-4528-a097-a95c9ca247c5';
update products set name = 'Professional Rat Comb', description = 'Fine tooth rat tail comb for clean, precise partings.' where id = 'b076303d-c4e5-4f23-8578-ba869c2039b2';
update products set name = 'Professional Tail Comb', description = 'Slim tail comb for sectioning and detailed styling.' where id = 'e9dc9f81-bc08-410f-8b3b-3ab99bcc98bb';
update products set name = 'Sabalon Hair Mousse 300ml', description = 'Light mousse that adds volume and holds your shape.' where id = '328c06fc-5cd8-4c0c-810f-6961888d6adb';
update products set name = 'Sabalon Holding Spray 300ml', description = 'Strong hold spray that locks your style in place.' where id = '0da0bfb1-4e19-4320-91b9-0a60883edd41';
update products set name = 'Salon Pro Bonding Glue 30ml', description = 'Secure bonding glue for a flat, long-lasting install.' where id = '30c29f6f-3b8a-4a97-881e-e3b698afa5ae';
update products set name = 'Soft Wig Cap', description = 'Soft stretch cap that grips without pressure or slipping.' where id = 'd1dc618d-1359-46f2-a850-446d90bb702b';

-- Fix the category spelling
update products set category = 'Hair Extensions' where category = 'Hair Extentions';

-- Tidy any remaining stray whitespace across the table
update products set name = trim(regexp_replace(name, '\s+', ' ', 'g'));
update products set description = trim(regexp_replace(description, '\s+', ' ', 'g'));