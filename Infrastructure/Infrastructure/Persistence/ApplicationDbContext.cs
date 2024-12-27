using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<MedicalRecord> MedicalRecords { get; set; }
        public DbSet<Appointment> Appointments { get; set; }
        public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("uuid-ossp");

      modelBuilder.Entity<User>(entity =>
            {
              entity.ToTable("users");
              entity.HasKey(e => e.Id);
              entity.Property(e => e.Id)
                  .HasColumnType("uuid")
                  .HasDefaultValueSql("uuid_generate_v4()")
                  .ValueGeneratedOnAdd();
              entity.Property(e => e.Username).IsRequired().HasMaxLength(100);
              entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
              entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(200);
              entity.Property(e => e.Role).HasMaxLength(50).HasDefaultValue("Doctor");
            });

      modelBuilder.Entity<Patient>(entity =>
            {
                entity.ToTable("patients");
                entity.HasKey(e => e.PatientId);
                entity.Property(e => e.PatientId)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.FirstName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.LastName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.DateOfBirth).IsRequired().HasColumnType("timestamp with time zone");
              entity.Property(e => e.Gender).IsRequired();
                entity.Property(e => e.ContactInformation).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Address).IsRequired().HasMaxLength(300);
            });

            modelBuilder.Entity<MedicalRecord>(entity =>
            {
                entity.ToTable("medical_records");
                entity.HasKey(e => e.RecordId);
                entity.Property(e => e.RecordId)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.PatientId).IsRequired();
                entity.Property(e => e.Date).IsRequired();
                entity.Property(e => e.Diagnosis).IsRequired().HasMaxLength(500);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                entity.HasMany(e => e.Prescriptions).WithOne().HasForeignKey(p => p.PrescriptionId);
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.ToTable("appointments");
                entity.HasKey(e => e.AppointmentId);
                entity.Property(e => e.AppointmentId)
                    .HasColumnType("uuid")
                    .HasDefaultValueSql("uuid_generate_v4()")
                    .ValueGeneratedOnAdd();
                entity.Property(e => e.PatientId).IsRequired();
                entity.Property(e => e.AppointmentDate).IsRequired();
                entity.Property(e => e.Reason).HasMaxLength(1000);
            });
        }
    }
}
