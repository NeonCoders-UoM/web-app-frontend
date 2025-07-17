// ADD THESE METHODS TO YOUR CustomersController.cs

// PUT: api/Customers/5 - Update customer
[Authorize(Roles = "SuperAdmin,Admin,ServiceCenterAdmin")]
[HttpPut("{id}")]
public async Task<IActionResult> UpdateCustomer(int id, CustomerUpdateDto dto)
{
var customer = await \_context.Customers.FindAsync(id);
if (customer == null)
{
return NotFound("Customer not found.");
}

    // Check if email already exists for another customer
    var existingCustomer = await _context.Customers
        .FirstOrDefaultAsync(c => c.Email == dto.Email && c.CustomerId != id);

    if (existingCustomer != null)
    {
        return BadRequest("Email is already in use by another customer.");
    }

    customer.FirstName = dto.FirstName;
    customer.LastName = dto.LastName;
    customer.Email = dto.Email;
    customer.PhoneNumber = dto.PhoneNumber;
    customer.Address = dto.Address;
    customer.NIC = dto.NIC;

    await _context.SaveChangesAsync();
    return Ok("Customer updated successfully.");

}

// POST: api/Customers - Create new customer
[Authorize(Roles = "SuperAdmin,Admin,ServiceCenterAdmin")]
[HttpPost]
public async Task<IActionResult> CreateCustomer(CustomerCreateDto dto)
{
// Check if email already exists
var existingCustomer = await \_context.Customers
.FirstOrDefaultAsync(c => c.Email == dto.Email);

    if (existingCustomer != null)
    {
        return BadRequest("Email is already in use.");
    }

    var customer = new Customer
    {
        FirstName = dto.FirstName,
        LastName = dto.LastName,
        Email = dto.Email,
        PhoneNumber = dto.PhoneNumber,
        Address = dto.Address,
        NIC = dto.NIC,
        LoyaltyPoints = 0 // Start with 0 points
    };

    _context.Customers.Add(customer);
    await _context.SaveChangesAsync();

    return CreatedAtAction(
        nameof(GetCustomerById),
        new { id = customer.CustomerId },
        new {
            customerId = customer.CustomerId,
            message = "Customer created successfully."
        }
    );

}

// DELETE: api/Customers/5 - Delete customer
[Authorize(Roles = "SuperAdmin,Admin")]
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteCustomer(int id)
{
var customer = await \_context.Customers
.Include(c => c.Vehicles)
.FirstOrDefaultAsync(c => c.CustomerId == id);

    if (customer == null)
    {
        return NotFound("Customer not found.");
    }

    // Check if customer has vehicles or appointments
    if (customer.Vehicles.Any())
    {
        return BadRequest("Cannot delete customer with registered vehicles.");
    }

    _context.Customers.Remove(customer);
    await _context.SaveChangesAsync();
    return Ok("Customer deleted successfully.");

}

// ADD THESE DTOs TO YOUR DTOs FOLDER:

public class CustomerUpdateDto
{
public string FirstName { get; set; }
public string LastName { get; set; }
public string Email { get; set; }
public string PhoneNumber { get; set; }
public string Address { get; set; }
public string NIC { get; set; }
}

public class CustomerCreateDto
{
public string FirstName { get; set; }
public string LastName { get; set; }
public string Email { get; set; }
public string PhoneNumber { get; set; }
public string Address { get; set; }
public string NIC { get; set; }
}
