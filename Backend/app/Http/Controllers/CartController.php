<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use Illuminate\Http\Request;

class CartController extends Controller
{
    //view the cart item
    public function index()
    {
        $user = auth()->user();
        $cart = Cart::with("cartItems.product")
            ->where("user_id", $user->id)
            ->first();

        return response()->json(["cart" => $cart]);
    }
    //Add item to the cart
    public function addToCart(Request $request)
    {
        $request->validate([
            "product_id" => "required|exists:products,id",
        ]);

        $user = auth()->user();
        $cart = Cart::where("user_id", $user->id)->firstOrCreate([
            "user_id" => $user->id,
        ]);

        $product_id = $request->input("product_id");

        // Check if the product is already in the cart
        $cartItem = $cart
            ->cartItems()
            ->where("product_id", $product_id)
            ->first();

        if ($cartItem) {
            // Update quantity if the product is already in the cart
            $cartItem->update(["quantity" => $cartItem->quantity + 1]);
        } else {
            // Add a new item to the cart
            $cartItem = $cart->cartItems()->create([
                "product_id" => $product_id,
                "quantity" => 1,
            ]);
        }

        // Update total price in real-time
        $totalAmount = $cart->total_amount + $cartItem->product->price;
        $cart->update(["total_amount" => $totalAmount]);

        return response()->json([
            "message" => "Product added to the cart successfully",
        ]);
    }
    //remove a single item from the cart
    public function removeCartItem($product_id)
    {
        $user = auth()->user();

        // Find the user's cart
        $cart = $user->cart;
        // Check if the cart exists
        if ($cart) {
            // Find the cart item with the given product_id
            $cartItem = $cart
                ->cartItems()
                ->where("product_id", $product_id)
                ->first();
            if ($cartItem) {
                $cart->update([
                    "total_amount" =>
                        $cart->total_amount - $cartItem->product->price,
                ]);
                // Check if quantity is greater than 1, reduce the quantity
                if ($cartItem->quantity > 1) {
                    $cartItem->update(["quantity" => $cartItem->quantity - 1]);
                } else {
                    // If quantity is 1, delete the cart item
                    $cartItem->delete();
                }
                return response()->json([
                    "message" => "Cart item updated successfully",
                ]);
            }
        }

        // If cart or cart item not found, return an error message
        return response()->json(["error" => "Cart item not found"], 404);
    }

    public function removeFromCart($product_id)
    {
        // Retrieve the authenticated user
        $user = auth()->user();

        // Find the cart item with the given product_id for the authenticated user
        $cartItem = CartItem::whereHas("cart", function ($query) use ($user) {
            $query->where("user_id", $user->id);
        })
            ->where("product_id", $product_id)
            ->first();

        // Check if the cart item exists
        if ($cartItem) {
            // Update the total amount in the cart
            $cartItem->cart->update([
                "total_amount" =>
                    $cartItem->cart->total_amount -
                    $cartItem->product->price * $cartItem->quantity,
            ]);

            // Delete the cart item
            $cartItem->delete();

            return response()->json([
                "message" => "Product removed from the cart successfully",
            ]);
        }

        // If cart item not found, return an error message
        return response()->json(["error" => "Cart item not found"], 404);
    }
}
