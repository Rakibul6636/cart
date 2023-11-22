<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    //cart fillable field.
    use HasFactory;
    protected $fillable = ['user_id', 'status', 'total_amount'];
    //relationship with User.
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    //relationship with CartItem
    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
}
