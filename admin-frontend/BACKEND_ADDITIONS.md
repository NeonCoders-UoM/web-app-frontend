// ADD THESE ENDPOINTS TO YOUR ServiceAvailabilityController.cs

// ServiceAvailabilityController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace YourNamespace.Controllers
{
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ServiceAvailabilityController : ControllerBase
{
private readonly YourDbContext \_context;

        public ServiceAvailabilityController(YourDbContext context)
        {
            _context = context;
        }

        // GET: api/ServiceAvailability/{serviceCenterId}?weekNumber={weekNumber}
        [HttpGet("{serviceCenterId}")]
        public async Task<ActionResult<IEnumerable<ServiceAvailability>>> GetServiceAvailabilities(
            int serviceCenterId, [FromQuery] int weekNumber)
        {
            var availabilities = await _context.ServiceAvailabilities
                .Where(sa => sa.ServiceCenterId == serviceCenterId && sa.WeekNumber == weekNumber)
                .Include(sa => sa.Service)
                .ToListAsync();

            return Ok(availabilities);
        }

        // GET: api/ServiceAvailability/{serviceCenterId}/{serviceId}?weekNumber={weekNumber}&day={day}
        [HttpGet("{serviceCenterId}/{serviceId}")]
        public async Task<ActionResult<IEnumerable<ServiceAvailability>>> GetServiceAvailability(
            int serviceCenterId, int serviceId, [FromQuery] int weekNumber, [FromQuery] string day = null)
        {
            var query = _context.ServiceAvailabilities
                .Where(sa => sa.ServiceCenterId == serviceCenterId && sa.ServiceId == serviceId && sa.WeekNumber == weekNumber);

            if (!string.IsNullOrEmpty(day))
            {
                query = query.Where(sa => sa.Day == day);
            }

            var availabilities = await query.ToListAsync();
            return Ok(availabilities);
        }

        // POST: api/ServiceAvailability
        [HttpPost]
        public async Task<ActionResult<ServiceAvailability>> CreateServiceAvailability(CreateServiceAvailabilityDto dto)
        {
            var availability = new ServiceAvailability
            {
                ServiceCenterId = dto.ServiceCenterId,
                ServiceId = dto.ServiceId,
                WeekNumber = dto.WeekNumber,
                Day = dto.Day,
                IsAvailable = dto.IsAvailable,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.ServiceAvailabilities.Add(availability);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceAvailability), new
            {
                serviceCenterId = availability.ServiceCenterId,
                serviceId = availability.ServiceId,
                weekNumber = availability.WeekNumber,
                day = availability.Day
            }, availability);
        }

        // PUT: api/ServiceAvailability/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceAvailability(int id, UpdateServiceAvailabilityDto dto)
        {
            var availability = await _context.ServiceAvailabilities.FindAsync(id);
            if (availability == null)
            {
                return NotFound("Service availability record not found.");
            }

            availability.IsAvailable = dto.IsAvailable;
            availability.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(availability);
        }

        // DELETE: api/ServiceAvailability/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceAvailability(int id)
        {
            var availability = await _context.ServiceAvailabilities.FindAsync(id);
            if (availability == null)
            {
                return NotFound("Service availability record not found.");
            }

            _context.ServiceAvailabilities.Remove(availability);
            await _context.SaveChangesAsync();

            return Ok("Service availability record deleted successfully.");
        }

        // DELETE: api/ServiceAvailability/bulk
        [HttpDelete("bulk")]
        public async Task<IActionResult> DeleteServiceAvailabilities([FromBody] int[] ids)
        {
            var availabilities = await _context.ServiceAvailabilities
                .Where(sa => ids.Contains(sa.Id))
                .ToListAsync();

            if (!availabilities.Any())
            {
                return NotFound("No service availability records found.");
            }

            _context.ServiceAvailabilities.RemoveRange(availabilities);
            await _context.SaveChangesAsync();

            return Ok($"{availabilities.Count} service availability records deleted successfully.");
        }
    }

}

// ADD THESE DTOs TO YOUR DTOs FOLDER:

public class CreateServiceAvailabilityDto
{
public int ServiceCenterId { get; set; }
public int ServiceId { get; set; }
public int WeekNumber { get; set; }
public string Day { get; set; } // "Mon", "Tue", etc.
public bool IsAvailable { get; set; }
}

public class UpdateServiceAvailabilityDto
{
public int ServiceCenterId { get; set; }
public int ServiceId { get; set; }
public int WeekNumber { get; set; }
public string Day { get; set; }
public bool IsAvailable { get; set; }
}

// ADD THIS ENTITY TO YOUR DbContext:

public class ServiceAvailability
{
public int Id { get; set; }
public int ServiceCenterId { get; set; }
public int ServiceId { get; set; }
public int WeekNumber { get; set; }
public string Day { get; set; } // "Mon", "Tue", etc.
public bool IsAvailable { get; set; }
public DateTime CreatedAt { get; set; }
public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public ServiceCenter ServiceCenter { get; set; }
    public SystemService Service { get; set; }

}

// ADD THIS TO YOUR DbContext OnModelCreating METHOD:

protected override void OnModelCreating(ModelBuilder modelBuilder)
{
// ... existing code ...

    modelBuilder.Entity<ServiceAvailability>()
        .HasOne(sa => sa.ServiceCenter)
        .WithMany(sc => sc.ServiceAvailabilities)
        .HasForeignKey(sa => sa.ServiceCenterId);

    modelBuilder.Entity<ServiceAvailability>()
        .HasOne(sa => sa.Service)
        .WithMany(s => s.ServiceAvailabilities)
        .HasForeignKey(sa => sa.ServiceId);

    // Add index for performance
    modelBuilder.Entity<ServiceAvailability>()
        .HasIndex(sa => new { sa.ServiceCenterId, sa.ServiceId, sa.WeekNumber, sa.Day })
        .IsUnique();

}

// ADD THIS NAVIGATION PROPERTY TO YOUR ServiceCenter ENTITY:

public class ServiceCenter
{
// ... existing properties ...

    public ICollection<ServiceAvailability> ServiceAvailabilities { get; set; }

}

// ADD THIS NAVIGATION PROPERTY TO YOUR SystemService ENTITY:

public class SystemService
{
// ... existing properties ...

    public ICollection<ServiceAvailability> ServiceAvailabilities { get; set; }

}

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
