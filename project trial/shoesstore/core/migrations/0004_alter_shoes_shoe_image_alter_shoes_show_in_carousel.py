# Generated by Django 5.1.5 on 2025-03-11 06:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_shoes_colour_shoes_discount_percentage_shoes_size_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='shoes',
            name='shoe_image',
            field=models.ImageField(blank=True, null=True, upload_to='shoe_images/'),
        ),
        migrations.AlterField(
            model_name='shoes',
            name='show_in_carousel',
            field=models.ImageField(blank=True, null=True, upload_to='shoe_images/'),
        ),
    ]
